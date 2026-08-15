import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';

const TABS = [
  { key: 'org', label: 'Organization' },
  { key: 'bu', label: 'Business Unit' },
  { key: 'features', label: 'Platform Features' },
  { key: 'system', label: 'System' },
];

export default function Settings() {
  const [tab, setTab] = useState('org');

  return (
    <>
      <PageHeader crumb="Settings" title="Settings" />
      <div className="content">
        <div className="settings-tabs">
          {TABS.map((t) => (
            <button key={t.key} className={`stab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {tab === 'org' && (
          <div className="section-grid">
            <div className="panel">
              <div className="panel-header"><h2>Organization</h2><span className="note">owner only</span></div>
              <div className="panel-body field-grid">
                <div className="field"><div className="k">Company name</div><div className="v">Bikes Direct Holding B.V.</div></div>
                <div className="field"><div className="k">Plan tier</div><div className="v">Growth</div></div>
                <div className="field"><div className="k">Business Units</div><div className="v">3 of 5 used</div></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><h2>Plan &amp; billing</h2></div>
              <div className="panel-body">
                <div className="rowline"><span className="l">Platform fee</span><span className="r">3.0%</span></div>
                <div className="rowline"><span className="l">Billing cycle</span><span className="r">Monthly</span></div>
                <div className="rowline"><span className="l">Invoices</span><span className="r rowlink">Download</span></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><h2>Security</h2></div>
              <div className="panel-body">
                <div className="toggle-row"><span>Enforce MFA</span><div className="toggle on"><div className="knob"></div></div></div>
                <div className="toggle-row"><span>Session timeout — 4 hours</span><div className="toggle"><div className="knob"></div></div></div>
                <div className="toggle-row"><span>Auto logout on inactivity</span><div className="toggle on"><div className="knob"></div></div></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'bu' && (
          <div className="section-grid">
            <div className="panel">
              <div className="panel-header"><h2>General</h2></div>
              <div className="panel-body field-grid">
                <div className="field"><div className="k">Display name</div><div className="v">NL &middot; Bikes Direct</div></div>
                <div className="field"><div className="k">ID prefix</div><div className="v">FP</div></div>
                <div className="field"><div className="k">Currency</div><div className="v muted">EUR (locked)</div></div>
                <div className="field"><div className="k">Region</div><div className="v muted">Netherlands (locked)</div></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><h2>Localization</h2></div>
              <div className="panel-body field-grid">
                <div className="field"><div className="k">Timezone</div><div className="v">Europe/Amsterdam</div></div>
                <div className="field"><div className="k">Date format</div><div className="v">DD-MM-YYYY</div></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><h2>Taxes</h2></div>
              <div className="panel-body">
                <div className="toggle-row"><span>VAT enabled</span><div className="toggle on"><div className="knob"></div></div></div>
                <div className="rowline"><span className="l">Tax registration no.</span><span className="r">NL809281736B01</span></div>
                <div className="rowline"><span className="l">Calculation</span><span className="r">Exclusive</span></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><h2>Pricing rules</h2></div>
              <div className="panel-body">
                <div className="rowline"><span className="l">Recovery percentage target</span><span className="r">85%</span></div>
                <div className="rowline"><span className="l">Profit margin target</span><span className="r">20%</span></div>
                <div className="rowline"><span className="l">Contract lengths offered</span><span className="r">6 / 12 / 24 / 36 mo</span></div>
                <div className="rowline"><span className="l">Price rounding</span><span className="r">Nearest &euro;0.50</span></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><h2>Catalog conditions</h2></div>
              <div className="panel-body">
                <div className="rowline"><span className="l">Excellent</span><span className="r">&times;1.00</span></div>
                <div className="rowline"><span className="l">Good</span><span className="r">&times;0.85</span></div>
                <div className="rowline"><span className="l">Fair</span><span className="r">&times;0.65</span></div>
                <div className="rowline"><span className="l">Poor / Damaged</span><span className="r">&times;0.40</span></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><h2>Custom fields</h2><button className="btn btn-secondary">+ Add field</button></div>
              <div className="panel-body">
                <div className="rowline"><span className="l">Customers &middot; "Loyalty tier" (select)</span><span className="r muted">active</span></div>
                <div className="rowline"><span className="l">Orders &middot; "PO number" (text)</span><span className="r muted">active</span></div>
              </div>
            </div>
          </div>
        )}

        {tab === 'features' && (
          <>
            <div className="panel">
              <div className="panel-header"><h2>Toggle capabilities</h2></div>
              <div className="panel-body">
                <div className="toggle-row"><span>Payments</span><div className="toggle on"><div className="knob"></div></div></div>
                <div className="toggle-row"><span>Checkout</span><div className="toggle on"><div className="knob"></div></div></div>
                <div className="toggle-row"><span>File management &amp; contract generation</span><div className="toggle on"><div className="knob"></div></div></div>
                <div className="toggle-row"><span>Activity timeline</span><div className="toggle on"><div className="knob"></div></div></div>
                <div className="toggle-row"><span>E-commerce integrations (Shopify)</span><div className="toggle"><div className="knob"></div></div></div>
              </div>
            </div>
            <div className="annot">Enabling a feature reveals its configuration section — e.g. turning on Payments surfaces Stripe setup under Integrations.</div>
          </>
        )}

        {tab === 'system' && (
          <div className="section-grid">
            <div className="panel">
              <div className="panel-header"><h2>API keys</h2><button className="btn btn-secondary">+ Generate key</button></div>
              <div className="table-scroll">
                <table>
                  <thead><tr><th>Key</th><th>Business Unit</th><th>Last used</th><th>Usage (30d)</th><th></th></tr></thead>
                  <tbody>
                    <tr><td>fp_live_&bull;&bull;&bull;&bull;8a2c</td><td>NL &middot; Bikes Direct</td><td>2026-07-04</td><td>18,204 calls</td><td><button className="btn btn-ghost">Revoke</button></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><h2>Activity log</h2></div>
              <div className="panel-body">
                <div className="rowline"><span className="l">P. Nadar — marked a payment as paid</span><span className="r muted">2026-07-04 09:12</span></div>
                <div className="rowline"><span className="l">API key fp_live_&bull;&bull;8a2c — created a subscription</span><span className="r muted">2026-07-03 22:40</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
