import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';

const STATUSES = ['Active', 'Completed', 'Bought Out', 'Upgraded', 'Early Return', 'Cancelled'];

export default function SubscriptionsList() {
  const [customerSearch, setCustomerSearch] = useState('');
  const [status, setStatus] = useState('');
  const path = `/subscriptions?${new URLSearchParams({ ...(customerSearch ? { customerSearch } : {}), ...(status ? { status } : {}) })}`;
  const { data: subs, loading, error } = useFetch(path);

  return (
    <>
      <PageHeader crumb="Subscriptions" title="Subscriptions">
        <div className="searchbar"><input placeholder="Search customer..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} /></div>
      </PageHeader>
      <div className="content">
        <div className="tag-row">
          <select className="tag-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="panel">
          <div className="panel-header"><h2>Subscriptions</h2></div>
          <div className="table-scroll">
            {loading && <div className="loading">Loading subscriptions...</div>}
            {error && <div className="error-state">{error}</div>}
            {subs && (
              <table>
                <thead><tr><th>Subscription</th><th>Customer</th><th>Product / variant</th><th>Status</th><th>Monthly</th><th>Contract end</th><th>Cost recovery</th></tr></thead>
                <tbody>
                  {subs.length === 0 && <tr className="empty-row"><td colSpan={7}>No subscriptions match these filters.</td></tr>}
                  {subs.map((s) => (
                    <tr key={s.id}>
                      <td><Link className="rowlink" to={`/subscriptions/${s.id}`}>{s.code}</Link></td>
                      <td>{s.customer.name}</td>
                      <td className="wrap">{s.product.name}{s.variant ? ` — ${s.variant.name}` : ''}</td>
                      <td><Pill domain="subscription" status={s.status} /></td>
                      <td>&euro;{s.monthly_price.toFixed(2)}</td>
                      <td>{s.end_date}</td>
                      <td>{s.costRecoveryPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
