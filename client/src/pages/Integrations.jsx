import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';

export default function Integrations() {
  return (
    <>
      <PageHeader crumb="Integrations" title="Integrations" />
      <div className="content">
        <div className="section-grid">
          <div className="integration-card">
            <div className="ico" style={{ background: 'var(--good-soft)', border: '1px solid var(--good)' }}></div>
            <div style={{ flex: 1 }}><h3>Stripe</h3><p>Automated recurring payments — charges follow the payment schedule automatically.</p></div>
            <Pill domain="payment" status="Paid" />
          </div>
          <div className="integration-card">
            <div className="ico" style={{ background: 'var(--warn-soft)', border: '1px solid var(--warn)' }}></div>
            <div style={{ flex: 1 }}><h3>Shopify</h3><p>Sync products and capture subscription orders from checkout.</p></div>
            <button className="btn btn-secondary">Connect</button>
          </div>
        </div>
        <div className="panel" style={{ marginTop: 18 }}>
          <div className="panel-header"><h2>REST API &amp; webhooks</h2><span className="note">api-first</span></div>
          <div className="panel-body">
            <div className="annot">Every action available in this dashboard — orders, subscriptions, assets, payments — is mirrored 1:1 by a REST endpoint, scoped to the active Business Unit's API key.</div>
          </div>
        </div>
      </div>
    </>
  );
}
