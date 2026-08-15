import { Router } from 'express';
import { db } from '../db.js';
import { assetRecoveryPct, assetIncomeCollected, subCode } from '../helpers.js';

const router = Router();

function summarize(a) {
  const product = db.prepare(`SELECT name FROM products WHERE id = ?`).get(a.product_id);
  const currentSub = db.prepare(`
    SELECT s.*, c.name AS customer_name FROM subscriptions s
    JOIN customers c ON c.id = s.customer_id
    WHERE s.asset_id = ? AND s.status = 'Active'
  `).get(a.id);
  return {
    ...a,
    productName: product?.name,
    customerName: currentSub?.customer_name ?? null,
    costRecoveryPct: assetRecoveryPct(a.id),
    incomeCollected: assetIncomeCollected(a.id),
  };
}

router.get('/', (req, res) => {
  const { status, condition, productId, search } = req.query;
  let sql = `SELECT * FROM assets WHERE 1=1`;
  const params = [];
  if (status) { sql += ` AND status = ?`; params.push(status); }
  if (condition) { sql += ` AND condition = ?`; params.push(condition); }
  if (productId) { sql += ` AND product_id = ?`; params.push(productId); }
  if (search) {
    sql += ` AND serial LIKE ?`;
    params.push(`%${search}%`);
  }
  sql += ` ORDER BY id DESC`;
  res.json(db.prepare(sql).all(...params).map(summarize));
});

router.get('/:id', (req, res) => {
  const a = db.prepare(`SELECT * FROM assets WHERE id = ?`).get(req.params.id);
  if (!a) return res.status(404).json({ error: 'Asset not found' });
  const subs = db.prepare(`
    SELECT s.*, c.name AS customer_name FROM subscriptions s
    JOIN customers c ON c.id = s.customer_id
    WHERE s.asset_id = ? ORDER BY s.id DESC
  `).all(a.id).map((s) => ({ ...s, code: subCode(s.id) }));
  const history = db.prepare(`SELECT * FROM activity_log WHERE entity_type = 'asset' AND entity_id = ? ORDER BY id DESC`).all(a.id);
  res.json({ ...summarize(a), subscriptions: subs, history });
});

router.post('/', (req, res) => {
  const { serial, productId, variantId, condition, acquisitionCost, acquisitionDate, location, notes } = req.body;
  if (!serial || !productId) return res.status(400).json({ error: 'serial and productId are required' });
  const info = db.prepare(`
    INSERT INTO assets (serial, product_id, variant_id, condition, status, acquisition_cost, acquisition_date, location, notes)
    VALUES (?, ?, ?, ?, 'Available', ?, ?, ?, ?)
  `).run(serial, productId, variantId ?? null, condition || 'Excellent', acquisitionCost || 0, acquisitionDate ?? null, location ?? null, notes ?? null);
  db.prepare(`INSERT INTO activity_log (entity_type, entity_id, message) VALUES ('asset', ?, ?)`).run(info.lastInsertRowid, 'Registered to inventory - condition: ' + (condition || 'Excellent'));
  res.status(201).json(summarize(db.prepare(`SELECT * FROM assets WHERE id = ?`).get(info.lastInsertRowid)));
});

router.patch('/:id', (req, res) => {
  const a = db.prepare(`SELECT * FROM assets WHERE id = ?`).get(req.params.id);
  if (!a) return res.status(404).json({ error: 'Asset not found' });
  const allowed = ['condition', 'status', 'unavailable_reason', 'location', 'notes', 'acquisition_cost', 'acquisition_date'];
  const next = { ...a, ...Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k))) };
  db.prepare(`
    UPDATE assets SET condition=?, status=?, unavailable_reason=?, location=?, notes=?, acquisition_cost=?, acquisition_date=? WHERE id=?
  `).run(next.condition, next.status, next.unavailable_reason, next.location, next.notes, next.acquisition_cost, next.acquisition_date, a.id);
  if (next.condition !== a.condition) {
    db.prepare(`INSERT INTO activity_log (entity_type, entity_id, message) VALUES ('asset', ?, ?)`).run(a.id, `Condition reassessed - ${next.condition}`);
  }
  res.json(summarize(db.prepare(`SELECT * FROM assets WHERE id = ?`).get(a.id)));
});

router.delete('/:id', (req, res) => {
  db.prepare(`UPDATE assets SET status = 'Unavailable', unavailable_reason = COALESCE(unavailable_reason, 'Removed from inventory') WHERE id = ?`).run(req.params.id);
  db.prepare(`INSERT INTO activity_log (entity_type, entity_id, message) VALUES ('asset', ?, 'Marked unavailable and removed from inventory')`).run(req.params.id);
  res.json({ ok: true });
});

export default router;
