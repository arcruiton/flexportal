import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';
import { api } from '../api.js';

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'];

export default function AssetDetail() {
  const { id } = useParams();
  const { data: asset, loading, error, reload } = useFetch(`/assets/${id}`);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [banner, setBanner] = useState(null);

  if (loading) return <div className="content"><div className="loading">Loading asset...</div></div>;
  if (error || !asset) return <div className="content"><div className="error-state">{error || 'Asset not found'}</div></div>;

  function startEdit() {
    setForm({ condition: asset.condition, location: asset.location || '', notes: asset.notes || '' });
    setEditing(true);
  }

  async function saveEdit(e) {
    e.preventDefault();
    await api.patch(`/assets/${id}`, form);
    setEditing(false);
    reload();
  }

  async function removeAsset() {
    try { await api.del(`/assets/${id}`); reload(); }
    catch (e) { setBanner(e.message); }
  }

  return (
    <>
      <PageHeader crumb={`Assets / ${asset.serial}`} title={asset.serial} />
      <div className="content">
        {banner && <div className="banner error">{banner}</div>}
        <div className="panel">
          <div className="panel-header">
            <h2>{asset.serial}</h2>
            <div className="action-row">
              <Pill domain="asset" status={asset.status} />
              <button className="btn btn-secondary" onClick={startEdit}>Edit</button>
              {asset.status !== 'Unavailable' && <button className="btn btn-danger" onClick={removeAsset}>Remove</button>}
            </div>
          </div>

          {!editing ? (
            <div className="panel-body section-grid">
              <div>
                <div className="field"><div className="k">Product / variant</div><div className="v">{asset.productName}</div></div>
                <div className="field" style={{ marginTop: 10 }}><div className="k">Condition</div><div className="v">{asset.condition}</div></div>
                <div className="field" style={{ marginTop: 10 }}><div className="k">Acquisition</div><div className="v muted">&euro;{asset.acquisition_cost.toFixed(2)} &middot; {asset.acquisition_date}</div></div>
                <div className="field" style={{ marginTop: 10 }}><div className="k">Location</div><div className="v muted">{asset.location || '-'}</div></div>
                {asset.unavailable_reason && <div className="field" style={{ marginTop: 10 }}><div className="k">Unavailable reason</div><div className="v muted">{asset.unavailable_reason}</div></div>}
              </div>
              <div>
                <div className="rowline"><span className="l">Total income collected</span><span className="r">&euro;{asset.incomeCollected.toFixed(2)}</span></div>
                <div className="rowline"><span className="l">Cost recovery</span><span className="r">{asset.costRecoveryPct}%</span></div>
                {asset.customerName && <div className="rowline"><span className="l">Current customer</span><span className="r">{asset.customerName}</span></div>}
              </div>
            </div>
          ) : (
            <form className="panel-body" onSubmit={saveEdit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Condition</label>
                  <select value={form.condition} onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}>
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-field"><label>Location</label><input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} /></div>
              </div>
              <div className="form-field" style={{ marginTop: 12 }}><label>Notes</label><textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} /></div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          )}
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Subscriptions on this asset</h2></div>
          <div className="panel-body">
            {asset.subscriptions.length === 0 && <div className="rowline"><span className="l muted">No subscriptions yet.</span></div>}
            {asset.subscriptions.map((s) => (
              <div className="rowline" key={s.id}>
                <span className="l"><Link className="rowlink" to={`/subscriptions/${s.id}`}>{s.code}</Link> &middot; {s.customer_name}</span>
                <span className="r">{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>History</h2></div>
          <div className="panel-body">
            <div className="timeline">
              {asset.history.map((h) => (
                <div className="tl-item" key={h.id}>
                  <span className="tl-dot"></span>
                  <div><div className="tl-date">{h.created_at?.slice(0, 10)}</div><div className="tl-txt">{h.message}</div></div>
                </div>
              ))}
              {asset.history.length === 0 && <div className="tl-txt" style={{ color: 'var(--muted)', fontWeight: 500 }}>No history recorded yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
