import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';
import { ExtendModal, ReplaceDeviceModal, UpgradeModal, BuyoutModal, EarlyReturnModal, CancelSubModal } from '../components/SubscriptionActions.jsx';

export default function SubscriptionDetail() {
  const { id } = useParams();
  const { data: sub, loading, error, reload } = useFetch(`/subscriptions/${id}`);
  const [action, setAction] = useState(null);

  if (loading) return <div className="content"><div className="loading">Loading subscription...</div></div>;
  if (error || !sub) return <div className="content"><div className="error-state">{error || 'Subscription not found'}</div></div>;

  const isActive = sub.status === 'Active';

  return (
    <>
      <PageHeader crumb={`Subscriptions / ${sub.code}`} title={sub.code} />
      <div className="content">
        <div className="panel">
          <div className="panel-header">
            <h2>{sub.code}</h2>
            <div className="action-row">
              <Pill domain="subscription" status={sub.status} />
              {isActive && (
                <>
                  <button className="btn btn-secondary" onClick={() => setAction('extend')}>Extend</button>
                  <button className="btn btn-secondary" onClick={() => setAction('upgrade')}>Upgrade</button>
                  <button className="btn btn-secondary" onClick={() => setAction('replace')}>Replace Device</button>
                  <button className="btn btn-secondary" onClick={() => setAction('buyout')}>Buyout</button>
                  <button className="btn btn-secondary" onClick={() => setAction('early-return')}>Early Return</button>
                  <button className="btn btn-danger" onClick={() => setAction('cancel')}>Cancel</button>
                </>
              )}
            </div>
          </div>
          <div className="panel-body section-grid">
            <div>
              <div className="field"><div className="k">Customer</div><div className="v"><Link className="rowlink" to={`/customers/${sub.customer.id}`}>{sub.customer.name}</Link> &middot; {sub.customer.type}</div></div>
              <div className="field" style={{ marginTop: 10 }}><div className="k">Asset</div><div className="v"><Link className="rowlink" to={`/assets/${sub.asset.id}`}>{sub.asset.serial}</Link> &middot; {sub.product.name} &middot; {sub.asset.status}</div></div>
              <div className="field" style={{ marginTop: 10 }}><div className="k">Contract</div><div className="v">{sub.contract_length} mo &middot; {sub.start_date} &rarr; {sub.end_date}</div></div>
            </div>
            <div>
              <div className="rowline"><span className="l">Income collected</span><span className="r">&euro;{sub.incomeCollected.toFixed(2)}</span></div>
              <div className="rowline"><span className="l">Cost recovery</span><span className="r">{sub.costRecoveryPct}%</span></div>
              <div className="rowline"><span className="l">Next payment</span><span className="r">{sub.nextPaymentDate || '-'}</span></div>
              <div className="rowline"><span className="l">Balance</span><span className="r">&euro;{sub.balance.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Payment schedule</h2></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Period</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {sub.payments.map((p) => (
                  <tr key={p.id}>
                    <td>{p.due_date}</td>
                    <td>&euro;{p.amount.toFixed(2)}</td>
                    <td><Pill domain="payment" status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Timeline</h2></div>
          <div className="panel-body">
            <div className="timeline">
              {sub.timeline.map((t) => (
                <div className="tl-item" key={t.id}>
                  <span className="tl-dot"></span>
                  <div><div className="tl-date">{t.created_at?.slice(0, 10)}</div><div className="tl-txt">{t.message}</div></div>
                </div>
              ))}
              {sub.timeline.length === 0 && <div className="tl-txt" style={{ color: 'var(--muted)', fontWeight: 500 }}>No events recorded yet.</div>}
            </div>
          </div>
        </div>
      </div>

      {action === 'extend' && <ExtendModal sub={sub} onClose={() => setAction(null)} onDone={() => { setAction(null); reload(); }} />}
      {action === 'replace' && <ReplaceDeviceModal sub={sub} onClose={() => setAction(null)} onDone={() => { setAction(null); reload(); }} />}
      {action === 'upgrade' && <UpgradeModal sub={sub} onClose={() => setAction(null)} onDone={() => { setAction(null); reload(); }} />}
      {action === 'buyout' && <BuyoutModal sub={sub} onClose={() => setAction(null)} onDone={() => { setAction(null); reload(); }} />}
      {action === 'early-return' && <EarlyReturnModal sub={sub} onClose={() => setAction(null)} onDone={() => { setAction(null); reload(); }} />}
      {action === 'cancel' && <CancelSubModal sub={sub} onClose={() => setAction(null)} onDone={() => { setAction(null); reload(); }} />}
    </>
  );
}
