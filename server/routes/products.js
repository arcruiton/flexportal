import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

function fullProduct(p) {
  const variants = db.prepare(`SELECT * FROM variants WHERE product_id = ? ORDER BY id`).all(p.id);
  const tiers = db.prepare(`SELECT * FROM pricing_tiers WHERE product_id = ? ORDER BY contract_length`).all(p.id);
  const subCount = db.prepare(`SELECT COUNT(*) AS c FROM subscriptions WHERE product_id = ?`).get(p.id).c;
  return { ...p, variants, pricingTiers: tiers, hasSubscriptions: subCount > 0 };
}

router.get('/', (req, res) => {
  const { status, category, search } = req.query;
  let sql = `SELECT * FROM products WHERE 1=1`;
  const params = [];
  if (status) { sql += ` AND status = ?`; params.push(status); }
  if (category) { sql += ` AND category = ?`; params.push(category); }
  if (search) {
    sql += ` AND (name LIKE ? OR sku LIKE ? OR brand LIKE ? OR category LIKE ?)`;
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }
  sql += ` ORDER BY id DESC`;
  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(fullProduct));
});

router.get('/:id', (req, res) => {
  const p = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(fullProduct(p));
});

router.post('/', (req, res) => {
  const { name, sku, category, brand, specification, variants = [], pricingTiers = [] } = req.body;
  if (!name || !sku) return res.status(400).json({ error: 'name and sku are required' });
  const info = db.prepare(`INSERT INTO products (name, sku, category, brand, specification, status) VALUES (?, ?, ?, ?, ?, 'Active')`)
    .run(name, sku, category ?? null, brand ?? null, specification ?? null);
  const pid = info.lastInsertRowid;
  for (const v of variants) {
    db.prepare(`INSERT INTO variants (product_id, name, grade) VALUES (?, ?, ?)`).run(pid, v.name, v.grade || 'A');
  }
  for (const t of pricingTiers) {
    db.prepare(`INSERT INTO pricing_tiers (product_id, contract_length, monthly_price) VALUES (?, ?, ?)`).run(pid, t.contractLength, t.monthlyPrice);
  }
  res.status(201).json(fullProduct(db.prepare(`SELECT * FROM products WHERE id = ?`).get(pid)));
});

router.patch('/:id', (req, res) => {
  const p = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  const fields = ['name', 'sku', 'category', 'brand', 'specification', 'status'];
  const next = { ...p, ...Object.fromEntries(Object.entries(req.body).filter(([k]) => fields.includes(k))) };
  db.prepare(`UPDATE products SET name=?, sku=?, category=?, brand=?, specification=?, status=? WHERE id=?`)
    .run(next.name, next.sku, next.category, next.brand, next.specification, next.status, p.id);
  res.json(fullProduct(db.prepare(`SELECT * FROM products WHERE id = ?`).get(p.id)));
});

router.post('/:id/variants', (req, res) => {
  const { name, grade } = req.body;
  db.prepare(`INSERT INTO variants (product_id, name, grade) VALUES (?, ?, ?)`).run(req.params.id, name, grade || 'A');
  res.status(201).json(fullProduct(db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id)));
});

router.post('/:id/pricing-tiers', (req, res) => {
  const { contractLength, monthlyPrice } = req.body;
  db.prepare(`INSERT INTO pricing_tiers (product_id, contract_length, monthly_price) VALUES (?, ?, ?)`).run(req.params.id, contractLength, monthlyPrice);
  res.status(201).json(fullProduct(db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id)));
});

router.delete('/:id', (req, res) => {
  const subCount = db.prepare(`SELECT COUNT(*) AS c FROM subscriptions WHERE product_id = ?`).get(req.params.id).c;
  if (subCount > 0) return res.status(400).json({ error: 'Cannot delete a product with linked subscriptions' });
  db.prepare(`UPDATE products SET status = 'Discontinued' WHERE id = ?`).run(req.params.id);
  db.prepare(`UPDATE variants SET active = 0 WHERE product_id = ?`).run(req.params.id);
  res.json({ ok: true });
});

export default router;
