import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', end: true },
  { to: '/products', label: 'Products' },
  { to: '/orders', label: 'Orders' },
  { to: '/subscriptions', label: 'Subscriptions' },
  { to: '/assets', label: 'Assets' },
  { to: '/customers', label: 'Customers' },
  { to: '/payments', label: 'Payments & Billing' },
  { to: '/cost-recovery', label: 'Cost Recovery' },
];

const NAV_ITEMS_BOTTOM = [
  { to: '/integrations', label: 'Integrations' },
  { to: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand"><span className="mark"></span><span>FlexPortal</span></div>

      <div className="bu-switcher">
        <span className="k">Business Unit</span>
        <span className="v">NL &middot; Bikes Direct <small>3 units</small></span>
      </div>

      <ul className="nav">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.end} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="ico"></span>{item.label}
            </NavLink>
          </li>
        ))}
        <li className="nav-divider"></li>
        {NAV_ITEMS_BOTTOM.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="ico"></span>{item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="role-badge">
        <span className="dot"></span>
        <div><div className="who">Priya Nadar</div><div className="role">Business Unit Admin</div></div>
      </div>
    </aside>
  );
}
