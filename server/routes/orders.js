import { Router } from 'express';
import { db, logActivity } from '../db.js';
import { orderCode, subCode, addMonths, today, recomputeOrderStatus } from '../helpers.js';

const router = Router();

function fullOrder(o) {
  const customer = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(o.customer_id);
  const items = db.prepare(`
    SELECT oi.*, p.name AS product_name, v.name AS variant_name FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    LEFT JOIN variants v ON v.id = oi.variant_id
    WHERE oi.order_id = ? ORDER BY oi.id
  `).all(o.id).map((i) => ({ ...i, subscriptionCode: i.subscription_id ? subCode(i.subscription_id) : null }));
  const subscriptions = db.prepare(`
    SELECT s.* FROM subscriptions s WHERE s.order_item_id IN (SELECT id FROM order_items WHERE order_id = ?)
  `).all(o.id).map((s) => ({ ...s, code: subCode(s.id) }));
  const monthlyTotal = items.reduce((sum, i) => sum + i.monthly_price * i.quantity, 0);
  const contractValue = items.reduce((sum, i) => sum + i.monthly_price * i.quantity * i.contract_length, 0);
  return { ...o, code: orderCode(o.id), customer, items, subscriptions, monthlyTotal, contractValue };
}

router.get('/', (req, res) => {
  const { status, customerType, search } = req.query;
  let sql = `SELECT o.* FROM orders o JOIN customers c ON c.id = o.customer_id WHERE 1=1`;
  const params = [];
  if (status) { sql += ` AND o.status = ?`; params.push(status); }
  if (customerType) { sql += ` AND c.type = ?`; params.push(customerType); }
  if (search) {
    sql += ` AND (c.name LIKE ? OR c.email LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s);
  }
  sql += ` ORDER BY o.id DESC`;
  res.json(db.prepare(sql).all(...params).map(fullOrder));
});

router.get('/:id', (req, res) => {
  const o = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(req.params.id);
  if (!o) return res.status(404).json({ error: 'Order not found' });
  res.json(fullOrder(o));
});

router.post('/', (req, res) => {
  const { customerId, newCustomer, items = [], notes } = req.body;
  if (!items.length) return res.status(400).json({ error: 'At least one order item is required' });

  let custId = customerId;
  if (!custId && newCustomer) {
    const nc = newCustomer;
    custId = db.prepare(`
      INSERT INTO customers (name, email, phone, type, billing_street, billing_city, billing_postal, billing_country, shipping_same)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `).run(nc.name, nc.email, nc.phone ?? null, nc.type || 'Individual', nc.billingAddress?.street ?? null, nc.billingAddress?.city ?? null, nc.billingAddress?.postal ?? null, nc.billingAddress?.country ?? null).lastInsertRowid;
  }
  if (!custId) return res.status(400).json({ error: 'customerId or newCustomer is required' });

  const orderId = db.prepare(`INSERT INTO orders (customer_id, status, notes) VALUES (?, 'Pending', ?)`).run(custId, notes ?? null).lastInsertRowid;
  for (const it of items) {
    db.prepare(`INSERT INTO order_items (order_id, product_id, variant_id, contract_length, quantity, monthly_price) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(orderId, it.productId, it.variantId ?? null, it.contractLength, it.quantity || 1, it.monthlyPrice);
  }
  res.status(201).json(fullOrder(db.prepare(`SELECT * FROM orders WHERE id = ?`).get(orderId)));
});

router.patch('/:id', (req, res) => {
  const o = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(req.params.id);
  if (!o) return res.status(404).json({ error: 'Order not found' });
  const { notes } = req.body;
  db.prepare(`UPDATE orders SET notes = ? WHERE id = ?`).run(notes ?? o.notes, o.id);
  res.json(fullOrder(db.prepare(`SELECT * FROM orders WHERE id = ?`).get(o.id)));
});

router.post('/:id/items', (req, res) => {
  const { productId, variantId, contractLength, quantity, monthlyPrice } = req.body;
  db.prepare(`INSERT INTO order_items (order_id, product_id, variant_id, contract_length, quantity, monthly_price) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(req.params.id, productId, variantId ?? null, contractLength, quantity || 1, monthlyPrice);
  res.status(201).json(fullOrder(db.prepare(`SELECT * FROM orders WHERE id = ?`).get(req.params.id)));
});

router.post('/:id/confirm', (req, res) => {
  const o = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(req.params.id);
  if (!o) return res.status(404).json({ error: 'Order not found' });
  if (o.status !== 'Pending') return res.status(400).json({ error: 'Only pending orders can be confirmed' });
  db.prepare(`UPDATE orders SET status = 'Confirmed' WHERE id = ?`).run(o.id);
  res.json(fullOrder(db.prepare(`SELECT * FROM orders WHERE id = ?`).get(o.id)));
});

router.post('/:id/cancel', (req, res) => {
  const o = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(req.params.id);
  if (!o) return res.status(404).json({ error: 'Order not found' });
  const fulfilledCount = db.prepare(`SELECT COUNT(*) AS c FROM order_items WHERE order_id = ? AND subscription_id IS NOT NULL`).get(o.id).c;
  if (fulfilledCount > 0) return res.status(400).json({ error: 'Cannot cancel an order that has fulfilled subscriptions' });
  db.prepare(`UPDATE orders SET status = 'Cancelled' WHERE id = ?`).run(o.id);
  res.json(fullOrder(db.prepare(`SELECT * FROM orders WHERE id = ?`).get(o.id)));
});

// Create a subscription from a specific order item by assigning a serialized asset
router.post('/items/:itemId/create-subscription', (req, res) => {
  const { serial, startDate } = req.body;
  const item = db.prepare(`SELECT * FROM order_items WHERE id = ?`).get(req.params.itemId);
  if (!item) return res.status(404).json({ error: 'Order item not found' });
  if (item.subscription_id) return res.status(400).json({ error: 'This item already has a subscription' });

  const asset = db.prepare(`SELECT * FROM assets WHERE serial = ?`).get(serial);
  if (!asset) return res.status(404).json({ error: `No asset found with serial ${serial}` });
  if (asset.status !== 'Available') return res.status(400).json({ error: `Asset ${serial} is not Available (currently ${asset.status})` });
  if (asset.product_id !== item.product_id) return res.status(400).json({ error: `Asset ${serial} does not match the ordered product` });

  const order = db.prepare(`SELECT * FROM orders WHERE id = ?`).get(item.order_id);
  const start = startDate || today();
  const end = addMonths(start, item.contract_length);

  const subId = db.prepare(`
    INSERT INTO subscriptions (order_item_id, customer_id, product_id, variant_id, asset_id, status, monthly_price, contract_length, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, 'Active', ?, ?, ?, ?)
  `).run(item.id, order.customer_id, item.product_id, item.variant_id, asset.id, item.monthly_price, item.contract_length, start, end).lastInsertRowid;

  for (let i = 1; i <= item.contract_length; i++) {
    db.prepare(`INSERT INTO payments (subscription_id, amount, due_date, status) VALUES (?, ?, ?, 'Pending')`)
      .run(subId, item.monthly_price, addMonths(start, i));
  }

  db.prepare(`UPDATE order_items SET subscription_id = ? WHERE id = ?`).run(subId, item.id);
  db.prepare(`UPDATE assets SET status = 'Rented Out' WHERE id = ?`).run(asset.id);
  logActivity('subscription', subId, `Subscription activated - asset ${serial} assigned, billing begins ${start}`);
  logActivity('asset', asset.id, `Assigned to ${subCode(subId)}`);
  recomputeOrderStatus(order.id);

  res.status(201).json(fullOrder(db.prepare(`SELECT * FROM orders WHERE id = ?`).get(order.id)));
});

export default router;
