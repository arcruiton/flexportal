import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';

export default function MarkPaidModal({ payment, onClose, onDone }) {
  const [paidDate, setPaidDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState('Bank transfer');
  const [reference, setReference] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/payments/${payment.id}/mark-paid`, { paidDate, method, reference });
      onDone();
    } catch (err) { setError(err.message); setSaving(false); }
  }

  return (
    <Modal title={`Mark as Paid — ${payment.code}`} onClose={onClose} width={380}>
      <form onSubmit={submit}>
        {error && <div className="banner error">{error}</div>}
        <div className="annot">Use this for offline payments (check, wire, cash) that were collected outside FlexPortal.</div>
        <div className="form-field" style={{ marginTop: 12 }}><label>Payment date</label><input type="date" required value={paidDate} onChange={(e) => setPaidDate(e.target.value)} /></div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>Bank transfer</option><option>Check</option><option>Cash</option>
          </select>
        </div>
        <div className="form-field" style={{ marginTop: 12 }}><label>Reference</label><input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. wire confirmation #" /></div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Confirm'}</button>
        </div>
      </form>
    </Modal>
  );
}
