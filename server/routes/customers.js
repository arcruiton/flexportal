import { Router } from 'express';
import { db } from '../db.js';
import { orderCode, subCode } from '../helpers.js';

const router = Router();

function summarize(c) {
  const activeSubs = db.prepare(`SELECT COUNT(*) AS c FROM subscriptions WHERE customer_id = ? AND status = 'Active'`).get(c.id).c;
  const lifetime = db.prepare(`
    SELECT COALESCE(SUM(p.amount), 0) AS total FROM payments p
    JOIN subscriptions s ON s.id = p.subscription_id
    WHERE s.customer_id = ? AND p.status = 'Paid'
  `).get(c.id).total;
  return { ...c, activeSubscriptions: activeSubs, lifetimeValue: lifetime };
}

router.get('/', (req, res) => {
  const { type, search } = req.query;
  let sql = `SELECT * FROM customers WHERE active = 1`;
  const params = [];
  if (type) { sql += ` AND type = ?`; params.push(type); }
  if (search) {
    sql += ` AND (name LIKE ? OR email LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s);
  }
  sql += ` ORDER BY id DESC`;
  res.json(db.prepare(sql).all(...params).map(summarize));
});

router.get('/:id', (req, res) => {
  const c = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Customer not found' });

  const orders = db.prepare(`SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC`).all(c.id)
    .map((o) => ({ ...o, code: orderCode(o.id) }));
  const payments = db.prepare(`
    SELECT p.*, s.id AS subscription_id FROM payments p
    JOIN subscriptions s ON s.id = p.subscription_id
    WHERE s.customer_id = ? ORDER BY p.due_date DESC
  `).all(c.id).map((p) => ({ ...p, subscriptionCode: subCode(p.subscription_id) }));
  const subs = db.prepare(`
    SELECT s.*, pr.name AS product_name, v.name AS variant_name FROM subscriptions s
    JOIN products pr ON pr.id = s.product_id
    LEFT JOIN variants v ON v.id = s.variant_id
    WHERE s.customer_id = ? ORDER BY s.id DESC
  `).all(c.id).map((s) => ({ ...s, code: subCode(s.id) }));
  const notes = db.prepare(`SELECT * FROM notes WHERE customer_id = ? ORDER BY id DESC`).all(c.id);

  res.json({ ...summarize(c), orders, payments, subscriptions: subs, notes });
});

router.post('/', (req, res) => {
  const { name, email, phone, type, billingAddress = {}, shippingSame = true, shippingAddress = {} } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email are required' });
  const info = db.prepare(`
    INSERT INTO customers (name, email, phone, type, billing_street, billing_city, billing_postal, billing_country, shipping_same, shipping_street, shipping_city, shipping_postal, shipping_country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name, email, phone ?? null, type || 'Individual',
    billingAddress.street ?? null, billingAddress.city ?? null, billingAddress.postal ?? null, billingAddress.country ?? null,
    shippingSame ? 1 : 0,
    shippingSame ? null : (shippingAddress.street ?? null),
    shippingSame ? null : (shippingAddress.city ?? null),
    shippingSame ? null : (shippingAddress.postal ?? null),
    shippingSame ? null : (shippingAddress.country ?? null)
  );
  res.status(201).json(summarize(db.prepare(`SELECT * FROM customers WHERE id = ?`).get(info.lastInsertRowid)));
});

router.patch('/:id', (req, res) => {
  const c = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Customer not found' });
  const allowed = ['name', 'email', 'phone', 'type', 'billing_street', 'billing_city', 'billing_postal', 'billing_country', 'shipping_same', 'shipping_street', 'shipping_city', 'shipping_postal', 'shipping_country'];
  const next = { ...c, ...Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k))) };
  db.prepare(`
    UPDATE customers SET name=?, email=?, phone=?, type=?, billing_street=?, billing_city=?, billing_postal=?, billing_country=?, shipping_same=?, shipping_street=?, shipping_city=?, shipping_postal=?, shipping_country=?
    WHERE id=?
  `).run(next.name, next.email, next.phone, next.type, next.billing_street, next.billing_city, next.billing_postal, next.billing_country, next.shipping_same, next.shipping_street, next.shipping_city, next.shipping_postal, next.shipping_country, c.id);
  res.json(summarize(db.prepare(`SELECT * FROM customers WHERE id = ?`).get(c.id)));
});

router.post('/:id/notes', (req, res) => {
  const { contactMethod, summary } = req.body;
  if (!summary) return res.status(400).json({ error: 'summary is required' });
  db.prepare(`INSERT INTO notes (customer_id, contact_method, summary) VALUES (?, ?, ?)`).run(req.params.id, contactMethod || 'Email', summary);
  res.status(201).json(db.prepare(`SELECT * FROM notes WHERE customer_id = ? ORDER BY id DESC`).all(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare(`UPDATE customers SET active = 0 WHERE id = ?`).run(req.params.id);
  res.json({ ok: true });
});

export default router;
