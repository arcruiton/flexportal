import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';

export default function CreateSubscriptionModal({ item, onClose, onCreated }) {
  const [serial, setSerial] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.post(`/orders/items/${item.id}/create-subscription`, { serial: serial.trim(), startDate });
      onCreated();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal title={`Create Subscription — ${item.product_name}`} onClose={onClose} width={420}>
      <form onSubmit={submit}>
        {error && <div className="banner error">{error}</div>}
        <div className="annot">Enter the serial number of an Available asset for this product to activate billing.</div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Serial number</label>
          <input required value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="e.g. FP-EB-00491" />
        </div>
        <div className="form-field" style={{ marginTop: 12 }}>
          <label>Start date</label>
          <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Activating...' : 'Create Subscription'}</button>
        </div>
      </form>
    </Modal>
  );
}
