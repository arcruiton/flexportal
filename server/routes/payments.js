import { Router } from 'express';
import { db } from '../db.js';
import { paymentCode, subCode, today } from '../helpers.js';

const router = Router();

function fullPayment(p) {
  const sub = db.prepare(`
    SELECT s.*, c.name AS customer_name FROM subscriptions s
    JOIN customers c ON c.id = s.customer_id
    WHERE s.id = ?
  `).get(p.subscription_id);
  return { ...p, code: paymentCode(p.id), subscriptionCode: subCode(p.subscription_id), customerName: sub?.customer_name, subscription: sub };
}

router.get('/', (req, res) => {
  const { status, customerSearch, dateFrom, dateTo } = req.query;
  let sql = `
    SELECT pay.* FROM payments pay
    JOIN subscriptions s ON s.id = pay.subscription_id
    JOIN customers c ON c.id = s.customer_id
    WHERE 1=1
  `;
  const params = [];
  if (status) { sql += ` AND pay.status = ?`; params.push(status); }
  if (dateFrom) { sql += ` AND pay.due_date >= ?`; params.push(dateFrom); }
  if (dateTo) { sql += ` AND pay.due_date <= ?`; params.push(dateTo); }
  if (customerSearch) { sql += ` AND (c.name LIKE ? OR c.email LIKE ?)`; params.push(`%${customerSearch}%`, `%${customerSearch}%`); }
  sql += ` ORDER BY pay.due_date ASC`;
  res.json(db.prepare(sql).all(...params).map(fullPayment));
});

router.get('/:id', (req, res) => {
  const p = db.prepare(`SELECT * FROM payments WHERE id = ?`).get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Payment not found' });
  res.json(fullPayment(p));
});

router.post('/:id/mark-paid', (req, res) => {
  const p = db.prepare(`SELECT * FROM payments WHERE id = ?`).get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Payment not found' });
  if (p.status === 'Paid') return res.status(400).json({ error: 'Payment is already marked paid' });
  const { paidDate, method, reference } = req.body;
  db.prepare(`UPDATE payments SET status = 'Paid', paid_date = ?, method = ?, reference = ? WHERE id = ?`)
    .run(paidDate || today(), method || 'Bank transfer', reference ?? null, p.id);
  res.json(fullPayment(db.prepare(`SELECT * FROM payments WHERE id = ?`).get(p.id)));
});

router.post('/:id/cancel', (req, res) => {
  const p = db.prepare(`SELECT * FROM payments WHERE id = ?`).get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Payment not found' });
  if (p.status === 'Paid' || p.status === 'Processing') return res.status(400).json({ error: 'Cannot cancel a payment that is already paid or processing' });
  db.prepare(`UPDATE payments SET status = 'Cancelled' WHERE id = ?`).run(p.id);
  res.json(fullPayment(db.prepare(`SELECT * FROM payments WHERE id = ?`).get(p.id)));
});

export default router;
