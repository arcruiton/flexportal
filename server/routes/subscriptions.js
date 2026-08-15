import { Router } from 'express';
import { db, logActivity } from '../db.js';
import { subCode, paymentCode, addMonths, today, subscriptionRecoveryPct } from '../helpers.js';

const router = Router();

function fullSub(s) {
  const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(s.customer_id);
  const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(s.product_id);
  const variant = s.variant_id ? db.prepare(`SELECT * FROM variants WHERE id = ?`).get(s.variant_id) : null;
  const asset = db.prepare(`SELECT * FROM assets WHERE id = ?`).get(s.asset_id);
  const payments = db.prepare(`SELECT * FROM payments WHERE subscription_id = ? ORDER BY due_date`).all(s.id)
    .map((p) => ({ ...p, code: paymentCode(p.id) }));
  const incomeCollected = payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const nextPayment = payments.find((p) => p.status === 'Pending');
  const balance = payments.filter((p) => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const timeline = db.prepare(`SELECT * FROM activity_log WHERE entity_type = 'subscription' AND entity_id = ? ORDER BY id`).all(s.id);
  return {
    ...s,
    code: subCode(s.id),
    customer,
    product,
    variant,
    asset,
    payments,
    incomeCollected,
    nextPaymentDate: nextPayment?.due_date ?? null,
    balance,
    costRecoveryPct: subscriptionRecoveryPct(s.id),
    totalContractValue: s.monthly_price * s.contract_length,
    timeline,
  };
}

router.get('/', (req, res) => {
  const { status, customerSearch, productId, serial } = req.query;
  let sql = `
    SELECT s.* FROM subscriptions s
    JOIN customers c ON c.id = s.customer_id
    JOIN assets a ON a.id = s.asset_id
    WHERE 1=1
  `;
  const params = [];
  if (status) { sql += ` AND s.status = ?`; params.push(status); }
  if (productId) { sql += ` AND s.product_id = ?`; params.push(productId); }
  if (serial) { sql += ` AND a.serial LIKE ?`; params.push(`%${serial}%`); }
  if (customerSearch) { sql += ` AND (c.name LIKE ? OR c.email LIKE ?)`; params.push(`%${customerSearch}%`, `%${customerSearch}%`); }
  sql += ` ORDER BY s.id DESC`;
  res.json(db.prepare(sql).all(...params).map(fullSub));
});

router.get('/:id', (req, res) => {
  const s = db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Subscription not found' });
  res.json(fullSub(s));
});

router.patch('/:id/notes', (req, res) => {
  const s = db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Subscription not found' });
  db.prepare(`UPDATE subscriptions SET notes = ? WHERE id = ?`).run(req.body.notes ?? null, s.id);
  res.json(fullSub(db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(s.id)));
});

function requireActive(s, res) {
  if (!s) { res.status(404).json({ error: 'Subscription not found' }); return false; }
  if (s.status !== 'Active') { res.status(400).json({ error: `Subscription is ${s.status}, not Active` }); return false; }
  return true;
}

router.post('/:id/extend', (req, res) => {
  const s = db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(req.params.id);
  if (!requireActive(s, res)) return;
  const months = Number(req.body.months);
  if (!months || months <= 0) return res.status(400).json({ error: 'months must be a positive number' });
  const newEnd = addMonths(s.end_date, months);
  for (let i = 1; i <= months; i++) {
    db.prepare(`INSERT INTO payments (subscription_id, amount, due_date, status) VALUES (?, ?, ?, 'Pending')`)
      .run(s.id, s.monthly_price, addMonths(s.end_date, i));
  }
  db.prepare(`UPDATE subscriptions SET end_date = ? WHERE id = ?`).run(newEnd, s.id);
  logActivity('subscription', s.id, `Extended by ${months} month(s) - new end date ${newEnd}`);
  res.json(fullSub(db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(s.id)));
});

router.post('/:id/replace-device', (req, res) => {
  const s = db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(req.params.id);
  if (!requireActive(s, res)) return;
  const { serial } = req.body;
  const newAsset = db.prepare(`SELECT * FROM assets WHERE serial = ?`).get(serial);
  if (!newAsset) return res.status(404).json({ error: `No asset found with serial ${serial}` });
  if (newAsset.status !== 'Available') return res.status(400).json({ error: `Asset ${serial} is not Available` });
  if (newAsset.product_id !== s.product_id) return res.status(400).json({ error: 'Replacement asset must be the same product' });

  const oldAssetId = s.asset_id;
  db.prepare(`UPDATE assets SET status = 'Returned' WHERE id = ?`).run(oldAssetId);
  db.prepare(`UPDATE assets SET status = 'Rented Out' WHERE id = ?`).run(newAsset.id);
  db.prepare(`UPDATE subscriptions SET asset_id = ? WHERE id = ?`).run(newAsset.id, s.id);
  logActivity('subscription', s.id, `Device replaced - ${serial} assigned in place of previous unit`);
  logActivity('asset', oldAssetId, `Unassigned from ${subCode(s.id)} - returned for inspection`);
  logActivity('asset', newAsset.id, `Assigned to ${subCode(s.id)} as a replacement device`);
  res.json(fullSub(db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(s.id)));
});

router.post('/:id/upgrade', (req, res) => {
  const s = db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(req.params.id);
  if (!requireActive(s, res)) return;
  const { productId, variantId, contractLength, monthlyPrice, serial, startDate } = req.body;
  const newAsset = db.prepare(`SELECT * FROM assets WHERE serial = ?`).get(serial);
  if (!newAsset) return res.status(404).json({ error: `No asset found with serial ${serial}` });
  if (newAsset.status !== 'Available') return res.status(400).json({ error: `Asset ${serial} is not Available` });

  db.prepare(`UPDATE payments SET status = 'Cancelled' WHERE subscription_id = ? AND status = 'Pending'`).run(s.id);
  db.prepare(`UPDATE assets SET status = 'Returned' WHERE id = ?`).run(s.asset_id);
  db.prepare(`UPDATE subscriptions SET status = 'Upgraded', end_date = ? WHERE id = ?`).run(today(), s.id);

  const start = startDate || today();
  const end = addMonths(start, contractLength);
  const newSubId = db.prepare(`
    INSERT INTO subscriptions (customer_id, product_id, variant_id, asset_id, status, monthly_price, contract_length, start_date, end_date)
    VALUES (?, ?, ?, ?, 'Active', ?, ?, ?, ?)
  `).run(s.customer_id, productId, variantId ?? null, newAsset.id, monthlyPrice, contractLength, start, end).lastInsertRowid;
  for (let i = 1; i <= contractLength; i++) {
    db.prepare(`INSERT INTO payments (subscription_id, amount, due_date, status) VALUES (?, ?, ?, 'Pending')`)
      .run(newSubId, monthlyPrice, addMonths(start, i));
  }
  db.prepare(`UPDATE assets SET status = 'Rented Out' WHERE id = ?`).run(newAsset.id);

  logActivity('subscription', s.id, `Upgraded to new subscription ${subCode(newSubId)}`);
  logActivity('subscription', newSubId, `Created via upgrade from ${subCode(s.id)} - asset ${serial} assigned`);
  res.status(201).json({
    previous: fullSub(db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(s.id)),
    upgraded: fullSub(db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(newSubId)),
  });
});

router.post('/:id/buyout', (req, res) => {
  const s = db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(req.params.id);
  if (!requireActive(s, res)) return;
  db.prepare(`UPDATE payments SET status = 'Cancelled' WHERE subscription_id = ? AND status = 'Pending'`).run(s.id);
  db.prepare(`UPDATE subscriptions SET status = 'Bought Out', end_date = ? WHERE id = ?`).run(today(), s.id);
  db.prepare(`UPDATE assets SET status = 'Sold' WHERE id = ?`).run(s.asset_id);
  logActivity('subscription', s.id, 'Customer bought out the asset - subscription closed as Bought Out');
  logActivity('asset', s.asset_id, `Sold to customer via buyout of ${subCode(s.id)}`);
  res.json(fullSub(db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(s.id)));
});

router.get('/:id/calculate-buyout', (req, res) => {
  const s = db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Subscription not found' });
  const asset = db.prepare(`SELECT * FROM assets WHERE id = ?`).get(s.asset_id);
  const recovered = db.prepare(`SELECT COALESCE(SUM(amount),0) AS t FROM payments WHERE subscription_id = ? AND status = 'Paid'`).get(s.id).t;
  const remaining = Math.max(asset.acquisition_cost - recovered, asset.acquisition_cost * 0.15);
  res.json({ buyoutPrice: Math.round(remaining * 100) / 100 });
});

router.get('/:id/calculate-early-return', (req, res) => {
  const s = db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(req.params.id);
  if (!s) return res.status(404).json({ error: 'Subscription not found' });
  const remainingPayments = db.prepare(`SELECT COUNT(*) AS c FROM payments WHERE subscription_id = ? AND status = 'Pending'`).get(s.id).c;
  const fee = Math.round(s.monthly_price * Math.min(remainingPayments, 3) * 0.5 * 100) / 100;
  res.json({ earlyReturnFee: fee, remainingPayments });
});

router.post('/:id/early-return', (req, res) => {
  const s = db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(req.params.id);
  if (!requireActive(s, res)) return;
  db.prepare(`UPDATE payments SET status = 'Cancelled' WHERE subscription_id = ? AND status = 'Pending'`).run(s.id);
  db.prepare(`UPDATE subscriptions SET status = 'Early Return', end_date = ? WHERE id = ?`).run(today(), s.id);
  db.prepare(`UPDATE assets SET status = 'Returned' WHERE id = ?`).run(s.asset_id);
  logActivity('subscription', s.id, 'Customer returned the asset early - subscription closed as Early Return');
  logActivity('asset', s.asset_id, `Returned early from ${subCode(s.id)} - awaiting inspection`);
  res.json(fullSub(db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(s.id)));
});

router.post('/:id/cancel', (req, res) => {
  const s = db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(req.params.id);
  if (!requireActive(s, res)) return;
  db.prepare(`UPDATE payments SET status = 'Cancelled' WHERE subscription_id = ? AND status = 'Pending'`).run(s.id);
  db.prepare(`UPDATE subscriptions SET status = 'Cancelled', end_date = ? WHERE id = ?`).run(today(), s.id);
  db.prepare(`UPDATE assets SET status = 'Returned' WHERE id = ?`).run(s.asset_id);
  logActivity('subscription', s.id, 'Subscription cancelled by admin');
  logActivity('asset', s.asset_id, `Returned - subscription ${subCode(s.id)} was cancelled`);
  res.json(fullSub(db.prepare(`SELECT * FROM subscriptions WHERE id = ?`).get(s.id)));
});

export default router;
