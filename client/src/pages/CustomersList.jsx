import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';
import NewCustomerModal from '../components/NewCustomerModal.jsx';

export default function CustomersList() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [showNew, setShowNew] = useState(false);
  const path = `/customers?${new URLSearchParams({ ...(search ? { search } : {}), ...(type ? { type } : {}) })}`;
  const { data: customers, loading, error, reload } = useFetch(path);

  return (
    <>
      <PageHeader crumb="Customers" title="Customers">
        <div className="searchbar"><input placeholder="Search name, email..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      </PageHeader>
      <div className="content">
        <div className="tag-row">
          <select className="tag-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            <option value="Individual">Individual</option>
            <option value="Business">Business</option>
          </select>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Customers</h2>
            <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Customer</button>
          </div>
          <div className="table-scroll">
            {loading && <div className="loading">Loading customers...</div>}
            {error && <div className="error-state">{error}</div>}
            {customers && (
              <table>
                <thead><tr><th>Customer</th><th>Email</th><th>Type</th><th>Active subs</th><th>Lifetime value</th></tr></thead>
                <tbody>
                  {customers.length === 0 && <tr className="empty-row"><td colSpan={5}>No customers match these filters.</td></tr>}
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td><Link className="rowlink" to={`/customers/${c.id}`}>{c.name}</Link></td>
                      <td>{c.email}</td>
                      <td><Pill domain="customer" status={c.type} /></td>
                      <td>{c.activeSubscriptions}</td>
                      <td>&euro;{c.lifetimeValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showNew && <NewCustomerModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); reload(); }} />}
    </>
  );
}
