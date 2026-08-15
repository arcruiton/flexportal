import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';
import { api } from '../api.js';
import NewProductModal from '../components/NewProductModal.jsx';

export default function ProductsList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showNew, setShowNew] = useState(false);
  const path = `/products?${new URLSearchParams({ ...(search ? { search } : {}), ...(status ? { status } : {}) })}`;
  const { data: products, loading, error, reload } = useFetch(path);

  return (
    <>
      <PageHeader crumb="Products" title="Products">
        <div className="searchbar"><input placeholder="Search name, SKU, brand..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      </PageHeader>
      <div className="content">
        <div className="tag-row">
          <select className="tag-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Discontinued">Discontinued</option>
          </select>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h2>Catalog</h2>
            <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Product</button>
          </div>
          <div className="table-scroll">
            {loading && <div className="loading">Loading products...</div>}
            {error && <div className="error-state">{error}</div>}
            {products && (
              <table>
                <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Brand</th><th>Status</th></tr></thead>
                <tbody>
                  {products.length === 0 && <tr className="empty-row"><td colSpan={5}>No products match these filters.</td></tr>}
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td><Link className="rowlink" to={`/products/${p.id}`}>{p.name}</Link></td>
                      <td>{p.sku}</td>
                      <td>{p.category}</td>
                      <td>{p.brand}</td>
                      <td><Pill domain="product" status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showNew && <NewProductModal onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); reload(); }} />}
    </>
  );
}
