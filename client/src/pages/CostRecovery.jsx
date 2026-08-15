import PageHeader from '../components/PageHeader.jsx';
import Pill from '../components/Pill.jsx';

export default function CostRecovery() {
  return (
    <>
      <PageHeader crumb="Cost Recovery" title="Cost Recovery" />
      <div className="content">
        <div className="annot" style={{ marginBottom: 14 }}>Portfolio-level reporting is illustrative here — per-asset and per-subscription cost recovery elsewhere in the app is computed live from real payment data.</div>

        <div className="panel">
          <div className="panel-header"><h2>Portfolio health</h2></div>
          <div className="panel-body">
            <div className="donut-wrap">
              <div className="donut" style={{ background: 'conic-gradient(var(--good) 0 38%, var(--accent) 38% 79%, var(--warn) 79% 94%, var(--muted) 94% 100%)' }}>
                <div className="hole"><div className="num">78</div><div className="lbl">health / 100</div></div>
              </div>
              <div className="dlegend">
                <div className="li"><span className="sw" style={{ background: 'var(--good)' }}></span>Profitable — 38%</div>
                <div className="li"><span className="sw" style={{ background: 'var(--accent)' }}></span>Recovering — 41%</div>
                <div className="li"><span className="sw" style={{ background: 'var(--warn)' }}></span>At risk — 15%</div>
                <div className="li"><span className="sw" style={{ background: 'var(--muted)' }}></span>No data — 6%</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 'auto' }}>
                <div className="rowline" style={{ minWidth: 220 }}><span className="l">Total unrecovered cost</span><span className="r">&euro;48,120</span></div>
                <div className="rowline" style={{ minWidth: 220 }}><span className="l">Total profit generated</span><span className="r">&euro;112,860</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><h2>Product performance comparison</h2></div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Product</th><th>Avg. breakeven</th><th>Lifetime recovery</th><th>Margin</th><th>Status mix</th></tr></thead>
              <tbody>
                <tr><td>Nimbus Crib Pro</td><td>4.1 mo</td><td>151%</td><td>31%</td><td><Pill domain="asset" status="Available" /></td></tr>
                <tr><td>PulseOx Monitor</td><td>6.0 mo</td><td>142%</td><td>26%</td><td><Pill domain="asset" status="Available" /></td></tr>
                <tr><td>AeroFlex Urban 500</td><td>5.2 mo</td><td>134%</td><td>22%</td><td><Pill domain="asset" status="Available" /></td></tr>
                <tr><td>CoreBook 14 Laptop</td><td>7.8 mo</td><td>98%</td><td>14%</td><td><Pill domain="asset" status="Rented Out" /></td></tr>
                <tr><td>Haven Lounge Sofa</td><td>9.3 mo</td><td>87%</td><td>11%</td><td><Pill domain="asset" status="Returned" /></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
