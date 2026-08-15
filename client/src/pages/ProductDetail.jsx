import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';
import { api } from '../api.js';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error, reload } = useFetch(`/products/${id}`);
  const [banner, setBanner] = useState(null);
  const [variantForm, setVariantForm] = useState({ name: '', grade: 'A' });
  const [tierForm, setTierForm] = useState({ contractLength: 12, monthlyPrice: '' });

  if (loading) return <div className="content"><div className="loading">Loading product...</div></div>;
  if (error || !product) return <div className="content"><div className="error-state">{error || 'Product not found'}</div></div>;

  async function toggleStatus() {
    const next = product.status === 'Active' ? 'Discontinued' : 'Active';
    await api.patch(`/products/${id}`, { status: next });
    reload();
  }

  async function addVariant(e) {
    e.preventDefault();
    if (!variantForm.name.trim()) return;
    await api.post(`/products/${id}/variants`, variantForm);
    setVariantForm({ name: '', grade: 'A' });
    reload();
  }

  async function addTier(e) {
    e.preventDefault();
    if (tierForm.monthlyPrice === '') return;
    await api.post(`/products/${id}/pricing-tiers`, { contractLength: Number(tierForm.contractLength), monthlyPrice: Number(tierForm.monthlyPrice) });
    setTierForm({ contractLength: 12, monthlyPrice: '' });
    reload();
  }

  async function deleteProduct() {
    try {
      await api.del(`/products/${id}`);
      navigate('/products');
    } catch (e) {
      setBanner(e.message);
    }
  }

  return (
    <>
      <PageHeader crumb={`Products / ${product.name}`} title={product.name} />
      <div className="content">
        {banner && <div className="banner error">{banner}</div>}
        <div className="panel">
          <div className="panel-header">
            <h2>{product.name}</h2>
            <div className="action-row">
              <Pill domain="product" status={product.status} />
              <button className="btn btn-secondary" onClick={toggleStatus}>{product.status === 'Active' ? 'Mark Discontinued' : 'Reactivate'}</button>
            </div>
          </div>
          <div className="panel-body field-grid">
            <div className="field"><div className="k">SKU</div><div className="v">{product.sku}</div></div>
            <div className="field"><div className="k">Category</div><div className="v">{product.category || '-'}</div></div>
            <div className="field"><div className="k">Brand</div><div className="v">{product.brand || '-'}</div></div>
            <div className="field"><div className="k">Specification</div><div className="v muted">{product.specification || '-'}</div></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Variants</h2></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Variant</th><th>Grade</th></tr></thead>
              <tbody>
                {product.variants.map((v) => (
                  <tr key={v.id}><td>{v.name}</td><td><Pill domain="asset" status={v.active ? 'Available' : 'Unavailable'} /> Grade {v.grade}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-body">
            <form onSubmit={addVariant} style={{ display: 'flex', gap: 8 }}>
              <input placeholder="Variant name" value={variantForm.name} onChange={(e) => setVariantForm((f) => ({ ...f, name: e.target.value }))} />
              <select value={variantForm.grade} onChange={(e) => setVariantForm((f) => ({ ...f, grade: e.target.value }))}>
                <option value="A">Grade A</option><option value="B">Grade B</option><option value="C">Grade C</option>
              </select>
              <button className="btn btn-secondary" type="submit">+ Add Variant</button>
            </form>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Pricing tiers</h2></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Contract length</th><th>Monthly price</th></tr></thead>
              <tbody>
                {product.pricingTiers.map((t) => (
                  <tr key={t.id}><td>{t.contract_length} months</td><td>&euro;{t.monthly_price.toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-body">
            <form onSubmit={addTier} style={{ display: 'flex', gap: 8 }}>
              <select value={tierForm.contractLength} onChange={(e) => setTierForm((f) => ({ ...f, contractLength: e.target.value }))}>
                {[6, 12, 24, 36].map((m) => <option key={m} value={m}>{m} months</option>)}
              </select>
              <input type="number" step="0.01" placeholder="Monthly price" value={tierForm.monthlyPrice} onChange={(e) => setTierForm((f) => ({ ...f, monthlyPrice: e.target.value }))} />
              <button className="btn btn-secondary" type="submit">+ Add Pricing Tier</button>
            </form>
          </div>
        </div>

        {!product.hasSubscriptions && (
          <button className="btn btn-danger" onClick={deleteProduct}>Delete Product</button>
        )}
        {product.hasSubscriptions && (
          <div className="annot">Delete is unavailable - this product has linked subscriptions.</div>
        )}
      </div>
    </>
  );
}
