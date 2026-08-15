import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';

export default function NewProductModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', sku: '', category: '', brand: '', specification: '' });
  const [variants, setVariants] = useState([{ name: '', grade: 'A' }]);
  const [tiers, setTiers] = useState([{ contractLength: 12, monthlyPrice: '' }]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post('/products', {
        ...form,
        variants: variants.filter((v) => v.name.trim()),
        pricingTiers: tiers.filter((t) => t.monthlyPrice !== '').map((t) => ({ contractLength: Number(t.contractLength), monthlyPrice: Number(t.monthlyPrice) })),
      });
      onCreated();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title="New Product" onClose={onClose} width={560}>
      <form onSubmit={submit}>
        {error && <div className="banner error">{error}</div>}
        <div className="form-grid">
          <div className="form-field"><label>Name</label><input required value={form.name} onChange={set('name')} /></div>
          <div className="form-field"><label>SKU</label><input required value={form.sku} onChange={set('sku')} /></div>
          <div className="form-field"><label>Category</label><input value={form.category} onChange={set('category')} /></div>
          <div className="form-field"><label>Brand</label><input value={form.brand} onChange={set('brand')} /></div>
        </div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Specification</label>
          <textarea value={form.specification} onChange={set('specification')} />
        </div>

        <div className="form-field" style={{ marginTop: 14 }}>
          <label>Variants</label>
          {variants.map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input placeholder="Variant name" value={v.name} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
              <select value={v.grade} onChange={(e) => setVariants((vs) => vs.map((x, j) => j === i ? { ...x, grade: e.target.value } : x))}>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={() => setVariants((vs) => [...vs, { name: '', grade: 'A' }])}>+ Add Variant</button>
        </div>

        <div className="form-field" style={{ marginTop: 14 }}>
          <label>Pricing tiers</label>
          {tiers.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <select value={t.contractLength} onChange={(e) => setTiers((ts) => ts.map((x, j) => j === i ? { ...x, contractLength: e.target.value } : x))}>
                {[6, 12, 24, 36].map((m) => <option key={m} value={m}>{m} months</option>)}
              </select>
              <input type="number" step="0.01" placeholder="Monthly price" value={t.monthlyPrice} onChange={(e) => setTiers((ts) => ts.map((x, j) => j === i ? { ...x, monthlyPrice: e.target.value } : x))} />
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={() => setTiers((ts) => [...ts, { contractLength: 12, monthlyPrice: '' }])}>+ Add Pricing Tier</button>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
        </div>
      </form>
    </Modal>
  );
}
