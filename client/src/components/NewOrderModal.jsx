import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';

function emptyItem() {
  return { productId: '', variantId: '', contractLength: '', quantity: 1, monthlyPrice: '' };
}

export default function NewOrderModal({ onClose, onCreated }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [mode, setMode] = useState('existing');
  const [customerId, setCustomerId] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', type: 'Individual', billingAddress: { street: '', city: '', postal: '', country: '' } });
  const [items, setItems] = useState([emptyItem()]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/customers').then(setCustomers);
    api.get('/products?status=Active').then(setProducts);
  }, []);

  function updateItem(i, patch) {
    setItems((its) => its.map((it, j) => {
      if (j !== i) return it;
      const next = { ...it, ...patch };
      if (patch.productId !== undefined) { next.variantId = ''; next.contractLength = ''; next.monthlyPrice = ''; }
      if (patch.contractLength !== undefined) {
        const product = products.find((p) => String(p.id) === String(next.productId));
        const tier = product?.pricingTiers.find((t) => String(t.contract_length) === String(patch.contractLength));
        next.monthlyPrice = tier ? tier.monthly_price : '';
      }
      return next;
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        items: items.filter((i) => i.productId && i.contractLength).map((i) => ({
          productId: Number(i.productId),
          variantId: i.variantId ? Number(i.variantId) : null,
          contractLength: Number(i.contractLength),
          quantity: Number(i.quantity) || 1,
          monthlyPrice: Number(i.monthlyPrice),
        })),
      };
      if (mode === 'existing') payload.customerId = Number(customerId);
      else payload.newCustomer = newCustomer;
      if (!payload.items.length) throw new Error('Add at least one order item');
      if (mode === 'existing' && !customerId) throw new Error('Select a customer');
      await api.post('/orders', payload);
      onCreated();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title="New Order" onClose={onClose} width={620}>
      <form onSubmit={submit}>
        {error && <div className="banner error">{error}</div>}

        <div className="segmented" style={{ marginBottom: 12 }}>
          <button type="button" className={`seg-btn${mode === 'existing' ? ' active' : ''}`} onClick={() => setMode('existing')}>Existing customer</button>
          <button type="button" className={`seg-btn${mode === 'new' ? ' active' : ''}`} onClick={() => setMode('new')}>New customer</button>
        </div>

        {mode === 'existing' ? (
          <div className="form-field">
            <label>Customer</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              <option value="">Select a customer...</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
            </select>
          </div>
        ) : (
          <div className="form-grid">
            <div className="form-field"><label>Name</label><input required value={newCustomer.name} onChange={(e) => setNewCustomer((c) => ({ ...c, name: e.target.value }))} /></div>
            <div className="form-field"><label>Email</label><input required type="email" value={newCustomer.email} onChange={(e) => setNewCustomer((c) => ({ ...c, email: e.target.value }))} /></div>
            <div className="form-field"><label>Phone</label><input value={newCustomer.phone} onChange={(e) => setNewCustomer((c) => ({ ...c, phone: e.target.value }))} /></div>
            <div className="form-field">
              <label>Customer type</label>
              <select value={newCustomer.type} onChange={(e) => setNewCustomer((c) => ({ ...c, type: e.target.value }))}>
                <option value="Individual">Individual</option><option value="Business">Business</option>
              </select>
            </div>
            <div className="form-field"><label>Billing street</label><input required value={newCustomer.billingAddress.street} onChange={(e) => setNewCustomer((c) => ({ ...c, billingAddress: { ...c.billingAddress, street: e.target.value } }))} /></div>
            <div className="form-field"><label>City</label><input required value={newCustomer.billingAddress.city} onChange={(e) => setNewCustomer((c) => ({ ...c, billingAddress: { ...c.billingAddress, city: e.target.value } }))} /></div>
            <div className="form-field"><label>Postal code</label><input required value={newCustomer.billingAddress.postal} onChange={(e) => setNewCustomer((c) => ({ ...c, billingAddress: { ...c.billingAddress, postal: e.target.value } }))} /></div>
            <div className="form-field"><label>Country</label><input required value={newCustomer.billingAddress.country} onChange={(e) => setNewCustomer((c) => ({ ...c, billingAddress: { ...c.billingAddress, country: e.target.value } }))} /></div>
          </div>
        )}

        <div className="form-field" style={{ marginTop: 16 }}>
          <label>Order items</label>
          {items.map((it, i) => {
            const product = products.find((p) => String(p.id) === String(it.productId));
            return (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={it.productId} onChange={(e) => updateItem(i, { productId: e.target.value })}>
                  <option value="">Product...</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select value={it.variantId} onChange={(e) => updateItem(i, { variantId: e.target.value })} disabled={!product}>
                  <option value="">Variant...</option>
                  {product?.variants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
                <select value={it.contractLength} onChange={(e) => updateItem(i, { contractLength: e.target.value })} disabled={!product}>
                  <option value="">Contract...</option>
                  {product?.pricingTiers.map((t) => <option key={t.id} value={t.contract_length}>{t.contract_length} mo - &euro;{t.monthly_price}</option>)}
                </select>
                <input type="number" min="1" style={{ width: 60 }} value={it.quantity} onChange={(e) => updateItem(i, { quantity: e.target.value })} />
                {items.length > 1 && <button type="button" className="btn btn-ghost" onClick={() => setItems((its) => its.filter((_, j) => j !== i))}>Remove</button>}
              </div>
            );
          })}
          <button type="button" className="btn btn-secondary" onClick={() => setItems((its) => [...its, emptyItem()])}>+ Add Item</button>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Order'}</button>
        </div>
      </form>
    </Modal>
  );
}
