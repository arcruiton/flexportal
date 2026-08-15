import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';

export function ExtendModal({ sub, onClose, onDone }) {
  const [months, setMonths] = useState(6);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try { await api.post(`/subscriptions/${sub.id}/extend`, { months: Number(months) }); onDone(); }
    catch (err) { setError(err.message); setSaving(false); }
  }
  return (
    <Modal title={`Extend ${sub.code}`} onClose={onClose} width={380}>
      <form onSubmit={submit}>
        {error && <div className="banner error">{error}</div>}
        <div className="annot">Adds months to the existing contract with the same asset and rate.</div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Additional months</label>
          <input type="number" min="1" value={months} onChange={(e) => setMonths(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Extending...' : 'Extend'}</button>
        </div>
      </form>
    </Modal>
  );
}

export function ReplaceDeviceModal({ sub, onClose, onDone }) {
  const [serial, setSerial] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try { await api.post(`/subscriptions/${sub.id}/replace-device`, { serial: serial.trim() }); onDone(); }
    catch (err) { setError(err.message); setSaving(false); }
  }
  return (
    <Modal title={`Replace Device — ${sub.code}`} onClose={onClose} width={380}>
      <form onSubmit={submit}>
        {error && <div className="banner error">{error}</div>}
        <div className="annot">Swaps the current asset for another Available unit of the same product. Terms and payments are unchanged.</div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label>New serial number</label>
          <input required value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="e.g. FP-EB-00491" />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Replacing...' : 'Replace Device'}</button>
        </div>
      </form>
    </Modal>
  );
}

export function UpgradeModal({ sub, onClose, onDone }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [variantId, setVariantId] = useState('');
  const [contractLength, setContractLength] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [serial, setSerial] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/products?status=Active').then(setProducts); }, []);
  const product = products.find((p) => String(p.id) === String(productId));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/subscriptions/${sub.id}/upgrade`, {
        productId: Number(productId), variantId: variantId ? Number(variantId) : null,
        contractLength: Number(contractLength), monthlyPrice: Number(monthlyPrice), serial: serial.trim(),
      });
      onDone();
    } catch (err) { setError(err.message); setSaving(false); }
  }

  return (
    <Modal title={`Upgrade ${sub.code}`} onClose={onClose} width={460}>
      <form onSubmit={submit}>
        {error && <div className="banner error">{error}</div>}
        <div className="annot">Ends this subscription as Upgraded and starts a new Active subscription on the selected product.</div>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <div className="form-field">
            <label>New product</label>
            <select required value={productId} onChange={(e) => { setProductId(e.target.value); setVariantId(''); setContractLength(''); setMonthlyPrice(''); }}>
              <option value="">Select...</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Variant</label>
            <select value={variantId} onChange={(e) => setVariantId(e.target.value)} disabled={!product}>
              <option value="">Select...</option>
              {product?.variants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Contract length</label>
            <select required value={contractLength} onChange={(e) => {
              setContractLength(e.target.value);
              const tier = product?.pricingTiers.find((t) => String(t.contract_length) === e.target.value);
              setMonthlyPrice(tier ? tier.monthly_price : '');
            }} disabled={!product}>
              <option value="">Select...</option>
              {product?.pricingTiers.map((t) => <option key={t.id} value={t.contract_length}>{t.contract_length} mo - &euro;{t.monthly_price}</option>)}
            </select>
          </div>
          <div className="form-field"><label>New serial number</label><input required value={serial} onChange={(e) => setSerial(e.target.value)} /></div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Upgrading...' : 'Upgrade'}</button>
        </div>
      </form>
    </Modal>
  );
}

export function BuyoutModal({ sub, onClose, onDone }) {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get(`/subscriptions/${sub.id}/calculate-buyout`).then((r) => setQuote(r.buyoutPrice)); }, [sub.id]);
  async function confirm() {
    setSaving(true);
    try { await api.post(`/subscriptions/${sub.id}/buyout`); onDone(); }
    catch (err) { setError(err.message); setSaving(false); }
  }
  return (
    <Modal title={`Buyout — ${sub.code}`} onClose={onClose} width={380}>
      {error && <div className="banner error">{error}</div>}
      <div className="rowline"><span className="l">Estimated buyout price</span><span className="r">{quote === null ? 'Calculating...' : `€${quote.toFixed(2)}`}</span></div>
      <div className="annot">Customer purchases the asset. Subscription closes as Bought Out and the asset becomes Sold.</div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={confirm} disabled={saving || quote === null}>{saving ? 'Processing...' : 'Confirm Buyout'}</button>
      </div>
    </Modal>
  );
}

export function EarlyReturnModal({ sub, onClose, onDone }) {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get(`/subscriptions/${sub.id}/calculate-early-return`).then(setQuote); }, [sub.id]);
  async function confirm() {
    setSaving(true);
    try { await api.post(`/subscriptions/${sub.id}/early-return`); onDone(); }
    catch (err) { setError(err.message); setSaving(false); }
  }
  return (
    <Modal title={`Early Return — ${sub.code}`} onClose={onClose} width={380}>
      {error && <div className="banner error">{error}</div>}
      <div className="rowline"><span className="l">Early return fee</span><span className="r">{quote === null ? 'Calculating...' : `€${quote.earlyReturnFee.toFixed(2)}`}</span></div>
      <div className="rowline"><span className="l">Remaining payments waived</span><span className="r">{quote?.remainingPayments ?? '-'}</span></div>
      <div className="annot">Customer returns the asset before contract completion. Subscription closes as Early Return; the asset is marked Returned pending inspection.</div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={confirm} disabled={saving || quote === null}>{saving ? 'Processing...' : 'Confirm Early Return'}</button>
      </div>
    </Modal>
  );
}

export function CancelSubModal({ sub, onClose, onDone }) {
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  async function confirm() {
    setSaving(true);
    try { await api.post(`/subscriptions/${sub.id}/cancel`); onDone(); }
    catch (err) { setError(err.message); setSaving(false); }
  }
  return (
    <Modal title={`Cancel ${sub.code}`} onClose={onClose} width={380}>
      {error && <div className="banner error">{error}</div>}
      <div className="annot">Admin-initiated termination. Halts remaining scheduled payments and returns the asset.</div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Keep Subscription</button>
        <button type="button" className="btn btn-danger" onClick={confirm} disabled={saving}>{saving ? 'Cancelling...' : 'Cancel Subscription'}</button>
      </div>
    </Modal>
  );
}
