import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';
import { useFetch } from '../useFetch.js';
import { api } from '../api.js';
import CreateSubscriptionModal from '../components/CreateSubscriptionModal.jsx';

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, loading, error, reload } = useFetch(`/orders/${id}`);
  const [banner, setBanner] = useState(null);
  const [subItem, setSubItem] = useState(null);

  if (loading) return <div className="content"><div className="loading">Loading order...</div></div>;
  if (error || !order) return <div className="content"><div className="error-state">{error || 'Order not found'}</div></div>;

  async function confirm() {
    try { await api.post(`/orders/${id}/confirm`); reload(); } catch (e) { setBanner(e.message); }
  }
  async function cancelOrder() {
    try { await api.post(`/orders/${id}/cancel`); reload(); } catch (e) { setBanner(e.message); }
  }

  const addr = order.customer.billing_street
    ? `${order.customer.billing_street}, ${order.customer.billing_city}, ${order.customer.billing_postal} ${order.customer.billing_country}`
    : '-';

  return (
    <>
      <PageHeader crumb={`Orders / ${order.code}`} title={order.code} />
      <div className="content">
        {banner && <div className="banner error">{banner}</div>}
        <div className="panel">
          <div className="panel-header">
            <h2>{order.code}</h2>
            <div className="action-row">
              <Pill domain="order" status={order.status} />
              {order.status === 'Pending' && <button className="btn btn-secondary" onClick={confirm}>Confirm Order</button>}
              {(order.status === 'Pending' || order.status === 'Confirmed') && <button className="btn btn-secondary" onClick={cancelOrder}>Cancel Order</button>}
            </div>
          </div>
          <div className="panel-body section-grid">
            <div>
              <div className="field"><div className="k">Customer</div><div className="v"><Link className="rowlink" to={`/customers/${order.customer.id}`}>{order.customer.name}</Link> &middot; {order.customer.type}</div></div>
              <div className="field" style={{ marginTop: 10 }}><div className="k">Contact</div><div className="v muted">{order.customer.email} {order.customer.phone ? `- ${order.customer.phone}` : ''}</div></div>
              <div className="field" style={{ marginTop: 10 }}><div className="k">Billing address</div><div className="v muted">{addr}</div></div>
            </div>
            <div>
              <div className="field"><div className="k">Financial summary</div></div>
              <div className="rowline"><span className="l">Monthly income (all items)</span><span className="r">&euro;{order.monthlyTotal.toFixed(2)}</span></div>
              <div className="rowline"><span className="l">Total contract value</span><span className="r">&euro;{order.contractValue.toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Order items</h2></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Product / variant</th><th>Contract</th><th>Qty</th><th>Monthly</th><th>Fulfillment</th><th></th></tr></thead>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id}>
                    <td className="wrap">{it.product_name}{it.variant_name ? ` — ${it.variant_name}` : ''}</td>
                    <td>{it.contract_length} mo</td>
                    <td>{it.quantity}</td>
                    <td>&euro;{it.monthly_price.toFixed(2)}</td>
                    <td>
                      {it.subscription_id
                        ? <><Pill domain="order" status="Fulfilled" /> <Link className="rowlink" to={`/subscriptions/${it.subscription_id}`}>{it.subscriptionCode}</Link></>
                        : <Pill domain="order" status="Pending" />}
                    </td>
                    <td>{!it.subscription_id && order.status !== 'Cancelled' && (
                      <button className="btn btn-ghost" onClick={() => setSubItem(it)}>Create Subscription</button>
                    )}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Subscriptions from this order</h2></div>
          <div className="panel-body">
            {order.subscriptions.length === 0 && <div className="rowline"><span className="l muted">No subscriptions created yet.</span></div>}
            {order.subscriptions.map((s) => (
              <div className="rowline" key={s.id}>
                <span className="l"><Link className="rowlink" to={`/subscriptions/${s.id}`}>{s.code}</Link></span>
                <span className="r">&euro;{s.monthly_price.toFixed(2)} / mo &middot; {s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {subItem && <CreateSubscriptionModal item={subItem} onClose={() => setSubItem(null)} onCreated={() => { setSubItem(null); reload(); }} />}
    </>
  );
}
