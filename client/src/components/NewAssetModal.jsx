import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';

export default function NewAssetModal({ onClose, onCreated }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ serial: '', productId: '', variantId: '', condition: 'Excellent', acquisitionCost: '', acquisitionDate: new Date().toISOString().slice(0, 10), location: '' });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/products?status=Active').then(setProducts); }, []);
  const product = products.find((p) => String(p.id) === String(form.productId));
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post('/assets', { ...form, productId: Number(form.productId), variantId: form.variantId ? Number(form.variantId) : null, acquisitionCost: Number(form.acquisitionCost) || 0 });
      onCreated();
    } catch (err) { setError(err.message); setSaving(false); }
  }

  return (
    <Modal title="New Asset" onClose={onClose} width={460}>
      <form onSubmit={submit}>
        {error && <div className="banner error">{error}</div>}
        <div className="form-grid">
          <div className="form-field"><label>Serial number</label><input required value={form.serial} onChange={set('serial')} /></div>
          <div className="form-field">
            <label>Product</label>
            <select required value={form.productId} onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value, variantId: '' }))}>
              <option value="">Select...</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Variant</label>
            <select value={form.variantId} onChange={set('variantId')} disabled={!product}>
              <option value="">None</option>
              {product?.variants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Condition</label>
            <select value={form.condition} onChange={set('condition')}>
              {['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-field"><label>Acquisition cost</label><input type="number" step="0.01" value={form.acquisitionCost} onChange={set('acquisitionCost')} /></div>
          <div className="form-field"><label>Acquisition date</label><input type="date" value={form.acquisitionDate} onChange={set('acquisitionDate')} /></div>
          <div className="form-field"><label>Location</label><input value={form.location} onChange={set('location')} placeholder="Warehouse - Rotterdam NL" /></div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Asset'}</button>
        </div>
      </form>
    </Modal>
  );
}
