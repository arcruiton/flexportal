import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';
import { api } from '../api.js';
import MarkPaidModal from '../components/MarkPaidModal.jsx';

export default function PaymentsList() {
  const [customerSearch, setCustomerSearch] = useState('');
  const [status, setStatus] = useState('');
  const [target, setTarget] = useState(null);
  const [banner, setBanner] = useState(null);
  const path = `/payments?${new URLSearchParams({ ...(customerSearch ? { customerSearch } : {}), ...(status ? { status } : {}) })}`;
  const { data: payments, loading, error, reload } = useFetch(path);

  async function cancelPayment(p) {
    try { await api.post(`/payments/${p.id}/cancel`); reload(); }
    catch (e) { setBanner(e.message); }
  }

  return (
    <>
      <PageHeader crumb="Payments & Billing" title="Payments">
        <div className="searchbar"><input placeholder="Search customer..." value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} /></div>
      </PageHeader>
      <div className="content">
        {banner && <div className="banner error">{banner}</div>}
        <div className="tag-row">
          <select className="tag-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {['Pending', 'Paid', 'Failed', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="panel">
          <div className="panel-header"><h2>Payments</h2></div>
          <div className="table-scroll">
            {loading && <div className="loading">Loading payments...</div>}
            {error && <div className="error-state">{error}</div>}
            {payments && (
              <table>
                <thead><tr><th>Payment</th><th>Customer</th><th>Subscription</th><th>Amount</th><th>Due date</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {payments.length === 0 && <tr className="empty-row"><td colSpan={7}>No payments match these filters.</td></tr>}
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td>{p.code}</td>
                      <td>{p.customerName}</td>
                      <td><Link className="rowlink" to={`/subscriptions/${p.subscription_id}`}>{p.subscriptionCode}</Link></td>
                      <td>&euro;{p.amount.toFixed(2)}</td>
                      <td>{p.due_date}</td>
                      <td><Pill domain="payment" status={p.status} /></td>
                      <td>
                        {p.status === 'Pending' && (
                          <div className="action-row">
                            <button className="btn btn-ghost" onClick={() => setTarget(p)}>Mark as Paid</button>
                            <button className="btn btn-ghost" style={{ color: 'var(--bad)' }} onClick={() => cancelPayment(p)}>Cancel</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {target && <MarkPaidModal payment={target} onClose={() => setTarget(null)} onDone={() => { setTarget(null); reload(); }} />}
    </>
  );
}
