import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';
import { api } from '../api.js';

export default function CustomerDetail() {
  const { id } = useParams();
  const { data: customer, loading, error, reload } = useFetch(`/customers/${id}`);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [noteMethod, setNoteMethod] = useState('Email');

  if (loading) return <div className="content"><div className="loading">Loading customer...</div></div>;
  if (error || !customer) return <div className="content"><div className="error-state">{error || 'Customer not found'}</div></div>;

  function startEdit() {
    setForm({ name: customer.name, email: customer.email, phone: customer.phone || '', type: customer.type });
    setEditing(true);
  }
  async function saveEdit(e) {
    e.preventDefault();
    await api.patch(`/customers/${id}`, form);
    setEditing(false);
    reload();
  }
  async function addNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    await api.post(`/customers/${id}/notes`, { contactMethod: noteMethod, summary: noteText });
    setNoteText('');
    reload();
  }

  return (
    <>
      <PageHeader crumb={`Customers / ${customer.name}`} title={customer.name} />
      <div className="content">
        <div className="panel">
          <div className="panel-header">
            <h2>{customer.name}</h2>
            <div className="action-row">
              <Pill domain="customer" status={customer.type} />
              <button className="btn btn-secondary" onClick={startEdit}>Edit</button>
              <Link className="btn btn-primary" to="/orders">+ New Order</Link>
            </div>
          </div>
          {!editing ? (
            <div className="panel-body field-grid">
              <div className="field"><div className="k">Email</div><div className="v">{customer.email}</div></div>
              <div className="field"><div className="k">Phone</div><div className="v">{customer.phone || '-'}</div></div>
              <div className="field"><div className="k">Active subscriptions</div><div className="v">{customer.activeSubscriptions}</div></div>
              <div className="field"><div className="k">Lifetime collected</div><div className="v">&euro;{customer.lifetimeValue.toFixed(2)}</div></div>
            </div>
          ) : (
            <form className="panel-body" onSubmit={saveEdit}>
              <div className="form-grid">
                <div className="form-field"><label>Name</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
                <div className="form-field"><label>Email</label><input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
                <div className="form-field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
                <div className="form-field">
                  <label>Type</label>
                  <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                    <option value="Individual">Individual</option><option value="Business">Business</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          )}
        </div>

        <div className="section-grid">
          <div className="panel">
            <div className="panel-header"><h2>Active subscriptions</h2></div>
            <div className="panel-body">
              {customer.subscriptions.filter((s) => s.status === 'Active').length === 0 && <div className="rowline"><span className="l muted">None active.</span></div>}
              {customer.subscriptions.filter((s) => s.status === 'Active').map((s) => (
                <div className="rowline" key={s.id}>
                  <span className="l"><Link className="rowlink" to={`/subscriptions/${s.id}`}>{s.code}</Link> &middot; {s.product_name}</span>
                  <span className="r">&euro;{s.monthly_price.toFixed(2)}/mo</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-header"><h2>Addresses</h2></div>
            <div className="panel-body">
              <div className="field"><div className="k">Billing</div><div className="v muted">{customer.billing_street ? `${customer.billing_street}, ${customer.billing_city}, ${customer.billing_postal} ${customer.billing_country}` : '-'}</div></div>
              <div className="field" style={{ marginTop: 10 }}><div className="k">Shipping</div><div className="v muted">{customer.shipping_same ? 'Same as billing' : `${customer.shipping_street}, ${customer.shipping_city}`}</div></div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Order &amp; payment history</h2></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Date</th><th>Type</th><th>Reference</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {customer.orders.map((o) => (
                  <tr key={`o${o.id}`}>
                    <td>{o.created_at?.slice(0, 10)}</td>
                    <td>Order</td>
                    <td><Link className="rowlink" to={`/orders/${o.id}`}>{o.code}</Link></td>
                    <td>-</td>
                    <td><Pill domain="order" status={o.status} /></td>
                  </tr>
                ))}
                {customer.payments.map((p) => (
                  <tr key={`p${p.id}`}>
                    <td>{p.due_date}</td>
                    <td>Payment</td>
                    <td>{p.subscriptionCode}</td>
                    <td>&euro;{p.amount.toFixed(2)}</td>
                    <td><Pill domain="payment" status={p.status} /></td>
                  </tr>
                ))}
                {customer.orders.length === 0 && customer.payments.length === 0 && (
                  <tr className="empty-row"><td colSpan={5}>No history yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Notes</h2></div>
          <div className="panel-body">
            {customer.notes.map((n) => (
              <div className="rowline" key={n.id}>
                <span className="l">{n.created_at?.slice(0, 10)} &middot; {n.contact_method} — {n.summary}</span>
              </div>
            ))}
            {customer.notes.length === 0 && <div className="rowline"><span className="l muted">No notes yet.</span></div>}
            <form onSubmit={addNote} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <select value={noteMethod} onChange={(e) => setNoteMethod(e.target.value)}>
                <option>Email</option><option>Phone</option><option>Meeting</option>
              </select>
              <input style={{ flex: 1 }} placeholder="Note summary..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
              <button className="btn btn-secondary" type="submit">+ Add Note</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
