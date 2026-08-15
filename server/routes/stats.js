import { Router } from 'express';
import { db } from '../db.js';
import { orderCode } from '../helpers.js';

const router = Router();

router.get('/overview', (req, res) => {
  const activeSubscriptions = db.prepare(`SELECT COUNT(*) AS c FROM subscriptions WHERE status = 'Active'`).get().c;
  const mrr = db.prepare(`SELECT COALESCE(SUM(monthly_price),0) AS t FROM subscriptions WHERE status = 'Active'`).get().t;

  const recovery = db.prepare(`
    SELECT a.id, a.acquisition_cost,
      COALESCE((SELECT SUM(p.amount) FROM payments p JOIN subscriptions s ON s.id = p.subscription_id WHERE s.asset_id = a.id AND p.status = 'Paid'), 0) AS collected
    FROM assets a WHERE a.acquisition_cost > 0
  `).all();
  const pcts = recovery.map((r) => (r.collected / r.acquisition_cost) * 100);
  const avgRecovery = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;

  const failedPayments = db.prepare(`SELECT COUNT(*) AS c FROM payments WHERE status = 'Failed'`).get().c;
  const pendingOrders = db.prepare(`SELECT COUNT(*) AS c FROM orders WHERE status IN ('Pending','Confirmed')`).get().c;
  const returnedAssets = db.prepare(`SELECT COUNT(*) AS c FROM assets WHERE status = 'Returned'`).get().c;
  const atRiskSubs = db.prepare(`SELECT COUNT(*) AS c FROM subscriptions WHERE status = 'Active'`).get().c;

  res.json({
    activeSubscriptions,
    mrr,
    avgCostRecoveryPct: avgRecovery,
    failedPayments,
    pendingOrders,
    returnedAssets,
    atRiskSubscriptions: pcts.filter((p) => p < 50).length,
  });
});

router.get('/attention', (req, res) => {
  const orders = db.prepare(`SELECT * FROM orders WHERE status = 'Pending' ORDER BY id DESC LIMIT 5`).all().map((o) => ({ ...o, code: orderCode(o.id) }));
  const failedPayments = db.prepare(`SELECT COUNT(*) AS c FROM payments WHERE status = 'Failed'`).get().c;
  const returnedAssets = db.prepare(`SELECT COUNT(*) AS c FROM assets WHERE status = 'Returned'`).get().c;
  res.json({ pendingOrders: orders, failedPaymentsCount: failedPayments, returnedAssetsCount: returnedAssets });
});

export default router;
