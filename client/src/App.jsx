import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Overview from './pages/Overview.jsx';
import ProductsList from './pages/ProductsList.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import OrdersList from './pages/OrdersList.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import SubscriptionsList from './pages/SubscriptionsList.jsx';
import SubscriptionDetail from './pages/SubscriptionDetail.jsx';
import AssetsList from './pages/AssetsList.jsx';
import AssetDetail from './pages/AssetDetail.jsx';
import CustomersList from './pages/CustomersList.jsx';
import CustomerDetail from './pages/CustomerDetail.jsx';
import PaymentsList from './pages/PaymentsList.jsx';
import CostRecovery from './pages/CostRecovery.jsx';
import Integrations from './pages/Integrations.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/subscriptions" element={<SubscriptionsList />} />
          <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
          <Route path="/assets" element={<AssetsList />} />
          <Route path="/assets/:id" element={<AssetDetail />} />
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/payments" element={<PaymentsList />} />
          <Route path="/cost-recovery" element={<CostRecovery />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}
