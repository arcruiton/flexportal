import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';
import NewAssetModal from '../components/NewAssetModal.jsx';

const STATUSES = ['Available', 'Rented Out', 'Returned', 'Sold', 'Unavailable'];

export default function AssetsList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showNew, setShowNew] = useState(false);
  const path = `/assets?${new URLSearchParams({ ...(search ? { search } : {}), ...(status ? { status } : {}) })}`;
  const { data: assets, loading, error, reload } = useFetch(path);

  return (
    <>
      <PageHeader crumb="Assets" title="Assets">
        <div className="searchbar"><input placeholder="Search serial number..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      </PageHeader>
      <div className="content">
        <div className="tag-row">
          <select className="tag-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Assets</h2>
            <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Asset</button>
          </div>
          <div className="table-scroll">
            {loading && <div className="loading">Loading assets...</div>}
            {error && <div className="error-state">{error}</div>}
            {assets && (
              <table>
                <thead><tr><th>Serial</th><th>Product</th><th>Status</th><th>Condition</th><th>Customer</th><th>Cost recovery</th><th>Location</th></tr></thead>
                <tbody>
                  {assets.length === 0 && <tr className="empty-row"><td colSpan={7}>No assets match these filters.</td></tr>}
                  {assets.map((a) => (
                    <tr key={a.id}>
                      <td><Link className="rowlink" to={`/assets/${a.id}`}>{a.serial}</Link></td>
                      <td>{a.productName}</td>
                      <td><Pill domain="asset" status={a.status} /></td>
                      <td>{a.condition}</td>
                      <td>{a.customerName || '-'}</td>
                      <td>{a.costRecoveryPct}%</td>
                      <td className="wrap">{a.location || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showNew && <NewAssetModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); reload(); }} />}
    </>
  );
}
