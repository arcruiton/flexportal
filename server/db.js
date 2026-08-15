import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'flexportal.db');
const isNewDb = !fs.existsSync(dbPath);

export const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  type TEXT NOT NULL DEFAULT 'Individual',
  billing_street TEXT, billing_city TEXT, billing_postal TEXT, billing_country TEXT,
  shipping_same INTEGER NOT NULL DEFAULT 1,
  shipping_street TEXT, shipping_city TEXT, shipping_postal TEXT, shipping_country TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  contact_method TEXT NOT NULL DEFAULT 'Email',
  summary TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  category TEXT,
  brand TEXT,
  specification TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS variants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id),
  name TEXT NOT NULL,
  grade TEXT NOT NULL DEFAULT 'A',
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS pricing_tiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id),
  contract_length INTEGER NOT NULL,
  monthly_price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  serial TEXT NOT NULL UNIQUE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  variant_id INTEGER REFERENCES variants(id),
  condition TEXT NOT NULL DEFAULT 'Excellent',
  status TEXT NOT NULL DEFAULT 'Available',
  unavailable_reason TEXT,
  acquisition_cost REAL NOT NULL DEFAULT 0,
  acquisition_date TEXT,
  location TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  variant_id INTEGER REFERENCES variants(id),
  contract_length INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  monthly_price REAL NOT NULL,
  subscription_id INTEGER REFERENCES subscriptions(id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_item_id INTEGER REFERENCES order_items(id),
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  variant_id INTEGER REFERENCES variants(id),
  asset_id INTEGER NOT NULL REFERENCES assets(id),
  status TEXT NOT NULL DEFAULT 'Active',
  monthly_price REAL NOT NULL,
  contract_length INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
  amount REAL NOT NULL,
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  paid_date TEXT,
  method TEXT,
  reference TEXT
);

CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

export function logActivity(entityType, entityId, message) {
  db.prepare(
    `INSERT INTO activity_log (entity_type, entity_id, message) VALUES (?, ?, ?)`
  ).run(entityType, entityId, message);
}

function addMonths(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 10);
}

if (isNewDb) {
  seed();
}

function seed() {
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const daysAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return iso(d);
  };

  const insCustomer = db.prepare(`
    INSERT INTO customers (name, email, phone, type, billing_street, billing_city, billing_postal, billing_country, shipping_same)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);
  const maria = insCustomer.run('Maria Torres', 'maria.torres@example.com', '+31 6 1234 5678', 'Individual', 'Prinsengracht 12', 'Amsterdam', '1015 AB', 'Netherlands').lastInsertRowid;
  const coreworks = insCustomer.run('CoreWorks Office Fleet', 'ap@coreworks.com', '+31 20 555 0110', 'Business', 'Zuidas 200', 'Amsterdam', '1082 MX', 'Netherlands').lastInsertRowid;
  const jonas = insCustomer.run('Jonas Berg', 'jonas.berg@example.com', '+46 70 123 4567', 'Individual', 'Storgatan 4', 'Malmo', '211 22', 'Sweden').lastInsertRowid;
  const aiko = insCustomer.run('Aiko Tanaka', 'aiko.tanaka@example.com', '+81 90 1234 5678', 'Individual', 'Sakura-cho 3-1', 'Yokohama', '220-0012', 'Japan').lastInsertRowid;
  insCustomer.run('Nimbus Hotels B.V.', 'facturen@nimbushotels.nl', '+31 10 555 0199', 'Business', 'Coolsingel 88', 'Rotterdam', '3012 AG', 'Netherlands');
  const sofie = insCustomer.run('Sofie Lindqvist', 'sofie.lindqvist@example.com', '+46 73 987 6543', 'Individual', 'Kungsgatan 21', 'Stockholm', '111 43', 'Sweden').lastInsertRowid;

  const insProduct = db.prepare(`
    INSERT INTO products (name, sku, category, brand, specification, status) VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insVariant = db.prepare(`INSERT INTO variants (product_id, name, grade) VALUES (?, ?, ?)`);
  const insTier = db.prepare(`INSERT INTO pricing_tiers (product_id, contract_length, monthly_price) VALUES (?, ?, ?)`);

  function makeProduct(name, sku, category, brand, spec, status, variants, tiers) {
    const pid = insProduct.run(name, sku, category, brand, spec, status).lastInsertRowid;
    const variantIds = variants.map((v) => insVariant.run(pid, v.name, v.grade).lastInsertRowid);
    tiers.forEach((t) => insTier.run(pid, t.months, t.price));
    return { pid, variantIds };
  }

  const aeroflex = makeProduct(
    'AeroFlex Urban 500', 'AFX-U500', 'Bikes & Micro-mobility', 'AeroFlex', '500Wh - belt drive - 45km range', 'Active',
    [{ name: 'Urban 500 - Charcoal, size M', grade: 'A' }, { name: 'Urban 500 - Charcoal, size L', grade: 'A' }, { name: 'Urban 500 - Refurbished', grade: 'B' }],
    [{ months: 6, price: 64 }, { months: 12, price: 49 }, { months: 24, price: 38.5 }, { months: 36, price: 32 }]
  );
  const helmet = makeProduct(
    'Helmet - Urban Reflective', 'HLM-REF', 'Bikes & Micro-mobility', 'AeroFlex', 'MIPS liner - USB rear light', 'Active',
    [{ name: 'Reflective - one size', grade: 'A' }],
    [{ months: 12, price: 15 }, { months: 24, price: 12 }]
  );
  const crib = makeProduct(
    'Nimbus Crib Pro', 'NCP-200', 'Baby Gear', 'Nimbus', 'Convertible 3-in-1 - solid beech', 'Active',
    [{ name: 'Crib Pro - Natural', grade: 'A' }, { name: 'Crib Pro - Refurbished', grade: 'B' }],
    [{ months: 6, price: 45 }, { months: 12, price: 39 }, { months: 24, price: 29 }]
  );
  const laptop = makeProduct(
    'CoreBook 14 Laptop', 'CBK-14', 'Electronics', 'CoreWorks', '14in - 16GB RAM - 512GB SSD', 'Active',
    [{ name: 'CoreBook 14 - Slate', grade: 'A' }],
    [{ months: 12, price: 61 }, { months: 24, price: 45 }, { months: 36, price: 36 }]
  );
  const sofa = makeProduct(
    'Haven Lounge Sofa', 'HLS-3S', 'Furniture', 'Haven', '3-seat - performance fabric', 'Active',
    [{ name: 'Lounge Sofa - Slate Grey', grade: 'A' }],
    [{ months: 12, price: 58 }, { months: 24, price: 44 }]
  );
  const pulseox = makeProduct(
    'PulseOx Monitor', 'POX-M2', 'Medical Devices', 'VitalTech', 'Continuous SpO2 + heart rate monitor', 'Active',
    [{ name: 'PulseOx M2', grade: 'A' }],
    [{ months: 6, price: 26 }, { months: 12, price: 22 }]
  );
  makeProduct(
    'Frostline Mini Fridge', 'FMF-90', 'Appliances', 'Frostline', '90L - quiet compressor', 'Discontinued',
    [{ name: 'Mini Fridge - White', grade: 'B' }],
    [{ months: 12, price: 18 }]
  );

  const insAsset = db.prepare(`
    INSERT INTO assets (serial, product_id, variant_id, condition, status, unavailable_reason, acquisition_cost, acquisition_date, location, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const a1 = insAsset.run('FP-EB-00482', aeroflex.pid, aeroflex.variantIds[0], 'Good', 'Rented Out', null, 880, daysAgo(240), 'With customer - Amsterdam NL', null).lastInsertRowid;
  const a2 = insAsset.run('FP-EB-00491', aeroflex.pid, aeroflex.variantIds[0], 'Excellent', 'Available', null, 900, daysAgo(20), 'Warehouse - Rotterdam NL', null).lastInsertRowid;
  const aHelmet = insAsset.run('FP-HL-00301', helmet.pid, helmet.variantIds[0], 'Excellent', 'Available', null, 40, daysAgo(30), 'Warehouse - Rotterdam NL', null).lastInsertRowid;
  const aCrib = insAsset.run('FP-CR-00119', crib.pid, crib.variantIds[0], 'Excellent', 'Available', null, 210, daysAgo(15), 'Warehouse - Rotterdam NL', null).lastInsertRowid;
  const aLaptop = insAsset.run('FP-LB-00027', laptop.pid, laptop.variantIds[0], 'Fair', 'Sold', null, 650, daysAgo(400), '-', 'Bought out by CoreWorks Office Fleet').lastInsertRowid;
  const aLaptop2 = insAsset.run('FP-LB-00033', laptop.pid, laptop.variantIds[0], 'Good', 'Rented Out', null, 700, daysAgo(180), 'With customer - Amsterdam NL', null).lastInsertRowid;
  const aMonitor = insAsset.run('FP-MD-00061', pulseox.pid, pulseox.variantIds[0], 'Fair', 'Returned', null, 190, daysAgo(300), 'Inspection queue - Rotterdam NL', 'Returned early, pending inspection').lastInsertRowid;
  const aSofa = insAsset.run('FP-SF-00014', sofa.pid, sofa.variantIds[0], 'Damaged', 'Unavailable', 'Water damage reported by customer', 520, daysAgo(500), 'Warehouse - Utrecht NL', 'Awaiting write-off decision').lastInsertRowid;

  const insOrder = db.prepare(`INSERT INTO orders (customer_id, status, notes) VALUES (?, ?, ?)`);
  const insItem = db.prepare(`INSERT INTO order_items (order_id, product_id, variant_id, contract_length, quantity, monthly_price, subscription_id) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const insSub = db.prepare(`INSERT INTO subscriptions (order_item_id, customer_id, product_id, variant_id, asset_id, status, monthly_price, contract_length, start_date, end_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insPayment = db.prepare(`INSERT INTO payments (subscription_id, amount, due_date, status, paid_date, method, reference) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  function createSubscriptionWithSchedule({ orderItemId, customerId, productId, variantId, assetId, monthlyPrice, contractLength, startDate, paidCount }) {
    const endDate = addMonths(startDate, contractLength);
    const subId = insSub.run(orderItemId, customerId, productId, variantId, assetId, 'Active', monthlyPrice, contractLength, startDate, endDate, null).lastInsertRowid;
    for (let i = 1; i <= contractLength; i++) {
      const due = addMonths(startDate, i);
      const isPaid = i <= paidCount;
      insPayment.run(subId, monthlyPrice, due, isPaid ? 'Paid' : 'Pending', isPaid ? due : null, isPaid ? 'Card' : null, isPaid ? `REF-${1000 + subId * 10 + i}` : null);
    }
    logActivity('subscription', subId, `Subscription activated - asset assigned, billing begins ${startDate}`);
    return subId;
  }

  // Maria Torres order: bike fulfilled, helmet still pending -> order Partial
  const ord1 = insOrder.run(maria, 'Partial', null).lastInsertRowid;
  const item1a = insItem.run(ord1, aeroflex.pid, aeroflex.variantIds[0], 24, 1, 49, null).lastInsertRowid;
  const item1b = insItem.run(ord1, helmet.pid, helmet.variantIds[0], 24, 1, 12, null).lastInsertRowid;
  const sub1 = createSubscriptionWithSchedule({ orderItemId: item1a, customerId: maria, productId: aeroflex.pid, variantId: aeroflex.variantIds[0], assetId: a1, monthlyPrice: 49, contractLength: 24, startDate: daysAgo(210), paidCount: 6 });
  db.prepare(`UPDATE order_items SET subscription_id = ? WHERE id = ?`).run(sub1, item1a);
  db.prepare(`UPDATE assets SET status = 'Rented Out' WHERE id = ?`).run(a1);

  // CoreWorks fulfilled order (laptop already bought out historically) - separate fulfilled order for a currently active laptop subscription
  const ord2 = insOrder.run(coreworks, 'Fulfilled', 'PO-2201 on file').lastInsertRowid;
  const item2 = insItem.run(ord2, laptop.pid, laptop.variantIds[0], 12, 1, 61, null).lastInsertRowid;
  const sub2 = createSubscriptionWithSchedule({ orderItemId: item2, customerId: coreworks, productId: laptop.pid, variantId: laptop.variantIds[0], assetId: aLaptop2, monthlyPrice: 61, contractLength: 12, startDate: daysAgo(150), paidCount: 5 });
  db.prepare(`UPDATE order_items SET subscription_id = ? WHERE id = ?`).run(sub2, item2);

  // Jonas Berg - confirmed order, not yet activated
  const ord3 = insOrder.run(jonas, 'Confirmed', null).lastInsertRowid;
  insItem.run(ord3, crib.pid, crib.variantIds[0], 12, 1, 39, null);

  // Aiko Tanaka - pending order
  const ord4 = insOrder.run(aiko, 'Pending', null).lastInsertRowid;
  insItem.run(ord4, pulseox.pid, pulseox.variantIds[0], 6, 1, 26, null);

  // Sofie Lindqvist - cancelled order
  const ord5 = insOrder.run(sofie, 'Cancelled', 'Customer changed their mind before fulfillment').lastInsertRowid;
  insItem.run(ord5, sofa.pid, sofa.variantIds[0], 12, 1, 58, null);

  // A historical bought-out laptop subscription tied to the sold asset, fully paid off
  const ordHist = insOrder.run(coreworks, 'Fulfilled', null).lastInsertRowid;
  const itemHist = insItem.run(ordHist, laptop.pid, laptop.variantIds[0], 12, 1, 61, null).lastInsertRowid;
  const subHist = createSubscriptionWithSchedule({ orderItemId: itemHist, customerId: coreworks, productId: laptop.pid, variantId: laptop.variantIds[0], assetId: aLaptop, monthlyPrice: 61, contractLength: 12, startDate: daysAgo(400), paidCount: 12 });
  db.prepare(`UPDATE order_items SET subscription_id = ? WHERE id = ?`).run(subHist, itemHist);
  db.prepare(`UPDATE subscriptions SET status = 'Bought Out' WHERE id = ?`).run(subHist);
  logActivity('subscription', subHist, 'Customer bought out the asset - subscription closed as Bought Out');

  // An early-returned monitor subscription
  const ordMon = insOrder.run(aiko, 'Fulfilled', null).lastInsertRowid;
  const itemMon = insItem.run(ordMon, pulseox.pid, pulseox.variantIds[0], 6, 1, 26, null).lastInsertRowid;
  const subMon = createSubscriptionWithSchedule({ orderItemId: itemMon, customerId: aiko, productId: pulseox.pid, variantId: pulseox.variantIds[0], assetId: aMonitor, monthlyPrice: 26, contractLength: 6, startDate: daysAgo(300), paidCount: 2 });
  db.prepare(`UPDATE order_items SET subscription_id = ? WHERE id = ?`).run(subMon, itemMon);
  db.prepare(`UPDATE subscriptions SET status = 'Early Return' WHERE id = ?`).run(subMon);
  db.prepare(`UPDATE payments SET status = 'Cancelled' WHERE subscription_id = ? AND status = 'Pending'`).run(subMon);
  logActivity('subscription', subMon, 'Customer returned the asset early - subscription closed as Early Return');

  db.prepare(`INSERT INTO notes (customer_id, contact_method, summary) VALUES (?, ?, ?)`).run(maria, 'Phone', 'Asked about upgrading to the cargo model once current contract ends.');
}
