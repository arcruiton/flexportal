import { db } from './db.js';

export const orderCode = (id) => `ORD-${10000 + Number(id)}`;
export const subCode = (id) => `SUB-${20000 + Number(id)}`;
export const paymentCode = (id) => `PMT-${80000 + Number(id)}`;

export function addMonths(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 10);
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function assetIncomeCollected(assetId) {
  const row = db.prepare(`
    SELECT COALESCE(SUM(p.amount), 0) AS total
    FROM payments p
    JOIN subscriptions s ON s.id = p.subscription_id
    WHERE s.asset_id = ? AND p.status = 'Paid'
  `).get(assetId);
  return row.total;
}

export function assetRecoveryPct(assetId) {
  const asset = db.prepare(`SELECT acquisition_cost FROM assets WHERE id = ?`).get(assetId);
  if (!asset || !asset.acquisition_cost) return 0;
  const total = assetIncomeCollected(assetId);
  return Math.round((total / asset.acquisition_cost) * 1000) / 10;
}

export function subscriptionRecoveryPct(subscriptionId) {
  const sub = db.prepare(`SELECT asset_id FROM subscriptions WHERE id = ?`).get(subscriptionId);
  if (!sub) return 0;
  const asset = db.prepare(`SELECT acquisition_cost FROM assets WHERE id = ?`).get(sub.asset_id);
  if (!asset || !asset.acquisition_cost) return 0;
  const row = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE subscription_id = ? AND status = 'Paid'
  `).get(subscriptionId);
  return Math.round((row.total / asset.acquisition_cost) * 1000) / 10;
}

export function recomputeOrderStatus(orderId) {
  const order = db.prepare(`SELECT status FROM orders WHERE id = ?`).get(orderId);
  if (!order || order.status === 'Cancelled') return;
  const items = db.prepare(`SELECT subscription_id FROM order_items WHERE order_id = ?`).all(orderId);
  const fulfilledCount = items.filter((i) => i.subscription_id).length;
  let status = order.status;
  if (fulfilledCount === 0) status = order.status === 'Pending' ? 'Pending' : 'Confirmed';
  else if (fulfilledCount === items.length) status = 'Fulfilled';
  else status = 'Partial';
  db.prepare(`UPDATE orders SET status = ? WHERE id = ?`).run(status, orderId);
}
