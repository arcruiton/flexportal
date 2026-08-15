import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useFetch } from '../useFetch.js';

export default function Overview() {
  const { data: stats, loading } = useFetch('/stats/overview');
  const { data: attention } = useFetch('/stats/attention');

  return (
    <>
      <PageHeader crumb="Overview" title="Overview" />
      <div className="content">
        {loading || !stats ? (
          <div className="loading">Loading overview...</div>
        ) : (
          <div className="kpi-row">
            <div className="kpi"><div className="k">Active Subscriptions</div><div className="v">{stats.activeSubscriptions}</div></div>
            <div className="kpi"><div className="k">Monthly Recurring Revenue</div><div className="v">&euro;{stats.mrr.toFixed(2)}</div></div>
            <div className="kpi"><div className="k">Avg. Cost Recovery</div><div className="v">{stats.avgCostRecoveryPct}%</div></div>
            <div className="kpi"><div className="k">Subscriptions at risk</div><div className="v">{stats.atRiskSubscriptions}</div></div>
          </div>
        )}

        <div className="panel">
          <div className="panel-header"><h2>How the core entities connect</h2><span className="note">Platform Overview</span></div>
          <div className="panel-body">
            <div className="flow">
              <div className="flow-box"><div className="t">Products</div><div className="s">catalog + pricing tiers</div></div>
              <div className="flow-arrow">&rarr;</div>
              <div className="flow-box"><div className="t">Orders</div><div className="s">customer commitment</div></div>
              <div className="flow-arrow">&rarr;</div>
              <div className="flow-box"><div className="t">Subscriptions</div><div className="s">active contract</div></div>
              <div className="flow-arrow">&harr;</div>
              <div className="flow-box"><div className="t">Assets</div><div className="s">serialized unit</div></div>
              <div className="flow-arrow">&rarr;</div>
              <div className="flow-box"><div className="t">Payments</div><div className="s">recurring billing</div></div>
            </div>
            <div className="annot">Customers attach to Orders and Subscriptions; every action here is mirrored by the FlexPortal REST API.</div>
          </div>
        </div>

        <div className="section-grid">
          <div className="panel">
            <div className="panel-header"><h2>Attention needed</h2></div>
            <div className="panel-body">
              <div className="rowline"><span className="l">Payments failed</span><span className="r">{attention?.failedPaymentsCount ?? '-'}</span></div>
              <div className="rowline"><span className="l">Orders pending confirmation</span><span className="r">{attention?.pendingOrders?.length ?? '-'}</span></div>
              <div className="rowline"><span className="l">Assets returned, awaiting inspection</span><span className="r">{attention?.returnedAssetsCount ?? '-'}</span></div>
              {attention?.pendingOrders?.map((o) => (
                <div className="rowline" key={o.id}>
                  <span className="l"><Link className="rowlink" to={`/orders/${o.id}`}>{o.code}</Link></span>
                  <span className="r muted">awaiting confirmation</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-header"><h2>Quick actions</h2></div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }} to="/products">+ New Product</Link>
              <Link className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }} to="/orders">+ New Order</Link>
              <Link className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }} to="/assets">+ New Asset</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
