import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';
import NewOrderModal from '../components/NewOrderModal.jsx';

export default function OrdersList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showNew, setShowNew] = useState(false);
  const path = `/orders?${new URLSearchParams({ ...(search ? { search } : {}), ...(status ? { status } : {}) })}`;
  const { data: orders, loading, error, reload } = useFetch(path);

  return (
    <>
      <PageHeader crumb="Orders" title="Orders">
        <div className="searchbar"><input placeholder="Search customer, email..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      </PageHeader>
      <div className="content">
        <div className="tag-row">
          <select className="tag-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {['Pending', 'Confirmed', 'Partial', 'Fulfilled', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Orders</h2>
            <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Order</button>
          </div>
          <div className="table-scroll">
            {loading && <div className="loading">Loading orders...</div>}
            {error && <div className="error-state">{error}</div>}
            {orders && (
              <table>
                <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Created</th><th>Monthly total</th></tr></thead>
                <tbody>
                  {orders.length === 0 && <tr className="empty-row"><td colSpan={5}>No orders match these filters.</td></tr>}
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td><Link className="rowlink" to={`/orders/${o.id}`}>{o.code}</Link></td>
                      <td>{o.customer.name}</td>
                      <td><Pill domain="order" status={o.status} /></td>
                      <td>{o.created_at?.slice(0, 10)}</td>
                      <td>&euro;{o.monthlyTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showNew && <NewOrderModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); reload(); }} />}
    </>
  );
}
