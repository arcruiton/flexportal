import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';

export default function NewCustomerModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'Individual', billingAddress: { street: '', city: '', postal: '', country: '' } });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post('/customers', form);
      onCreated();
    } catch (err) { setError(err.message); setSaving(false); }
  }

  return (
    <Modal title="New Customer" onClose={onClose} width={460}>
      <form onSubmit={submit}>
        {error && <div className="banner error">{error}</div>}
        <div className="form-grid">
          <div className="form-field"><label>Name</label><input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
          <div className="form-field"><label>Email</label><input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
          <div className="form-field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
          <div className="form-field">
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              <option value="Individual">Individual</option><option value="Business">Business</option>
            </select>
          </div>
          <div className="form-field"><label>Billing street</label><input value={form.billingAddress.street} onChange={(e) => setForm((f) => ({ ...f, billingAddress: { ...f.billingAddress, street: e.target.value } }))} /></div>
          <div className="form-field"><label>City</label><input value={form.billingAddress.city} onChange={(e) => setForm((f) => ({ ...f, billingAddress: { ...f.billingAddress, city: e.target.value } }))} /></div>
          <div className="form-field"><label>Postal code</label><input value={form.billingAddress.postal} onChange={(e) => setForm((f) => ({ ...f, billingAddress: { ...f.billingAddress, postal: e.target.value } }))} /></div>
          <div className="form-field"><label>Country</label><input value={form.billingAddress.country} onChange={(e) => setForm((f) => ({ ...f, billingAddress: { ...f.billingAddress, country: e.target.value } }))} /></div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Customer'}</button>
        </div>
      </form>
    </Modal>
  );
}
