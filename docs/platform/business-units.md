> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Business Units

> Multi-tenant architecture for different markets, brands, or business lines

A Business Unit is an isolated operational setup within your FlexPortal organization. Each Business Unit manages its own currency, tax rules, product catalog, payment accounts, configuration, and API access — completely independent from other Business Units.

**Common use cases:**

* **Store USD** and **Store EUR** — same products, different currencies
* **B2B Operations** and **B2C Operations** — different pricing and payment terms
* **Netherlands** and **Germany** — same currency (EUR) but different VAT rates
* **Test** and **Production** — safe testing without affecting live data

## What Each Business Unit Controls

Each Business Unit operates independently with:

| Component            | What's Separated                                     | Example                                           |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| **Currency**         | All pricing, payments, and reporting in one currency | EUR for Netherlands BU, USD for US BU             |
| **Tax Rules**        | VAT rates, sales tax, regional tax requirements      | 21% VAT in NL, 0% in Dubai, 8.25% sales tax in CA |
| **Payment Accounts** | Stripe account, bank account, merchant processor     | Separate Stripe account per region                |
| **Product Catalog**  | Products, variants, pricing tiers                    | Different products per market                     |
| **API Keys**         | Isolated access, separate integrations               | US team can't access EU data                      |
| **Reporting**        | Independent dashboards and financial reports         | Each BU has own P\&L                              |

<Warning>
  Business Units are completely isolated. A customer in Business Unit A cannot order products from Business Unit B. Assets from one Business Unit cannot be transferred to another.
</Warning>

## Organization Structure

Your FlexPortal account has this hierarchy:

```
Organization: TechRent Global
├── Business Unit: Netherlands (EUR)
│   ├── Products: 150 items
│   ├── Customers: 2,400
│   ├── Active Subscriptions: 1,800
│   └── API Key: pk_live_nl_...
├── Business Unit: United States (USD)
│   ├── Products: 200 items
│   ├── Customers: 3,100
│   ├── Active Subscriptions: 2,500
│   └── API Key: pk_live_us_...
└── Business Unit: Dubai (AED)
    ├── Products: 80 items
    ├── Customers: 450
    ├── Active Subscriptions: 320
    └── API Key: pk_live_ae_...
```

## When to Use Multiple Business Units

Create separate Business Units for these scenarios:

### 1. Different Countries

Each country requires different currency and tax treatment.

**Example: EU vs US Operations**

| Aspect          | Netherlands BU        | United States BU        |
| --------------- | --------------------- | ----------------------- |
| Currency        | EUR                   | USD                     |
| Tax             | 21% VAT               | State sales tax (0-10%) |
| Payment Account | Stripe NL             | Stripe US               |
| Product Catalog | European models       | US models               |
| Pricing         | Higher (VAT included) | Lower (tax varies)      |
| Invoicing       | VAT format required   | Sales tax format        |

**Why Separate:**

* Cannot mix EUR and USD in same Business Unit
* VAT and sales tax have different reporting requirements
* Payment processors often separate by country
* Product availability differs by market

### 2. Different Brands

Run multiple brands under one organization with separate product lines.

**Example: Premium vs Budget Brand**

| Aspect        | LuxeTech (Premium)    | ValueTech (Budget)    |
| ------------- | --------------------- | --------------------- |
| Product Range | Latest flagships      | Previous-gen models   |
| Pricing       | \$120-200/month       | \$40-80/month         |
| Target Market | Business customers    | Students, individuals |
| Payment Terms | Net 30 for businesses | Immediate payment     |
| Branding      | Separate domain, logo | Separate domain, logo |

**Why Separate:**

* Different product catalogs and pricing strategies
* Separate brand identities and customer bases
* Different payment and credit terms
* Independent financial reporting

### 3. Different Business Lines

Separate B2B and B2C operations with different requirements.

**Example: Consumer vs Business Operations**

| Aspect         | B2C Business Unit | B2B Business Unit         |
| -------------- | ----------------- | ------------------------- |
| Customers      | Individuals       | Companies                 |
| Contract Terms | 12-24 months      | 36-48 months              |
| Pricing        | Standard retail   | Volume discounts          |
| Billing        | Monthly auto-pay  | Net 30 invoicing          |
| Payment Method | Card              | Bank transfer             |
| Support        | Self-service      | Dedicated account manager |

**Why Separate:**

* Different pricing structures and terms
* Different billing and payment workflows
* Separate reporting for consumer vs enterprise
* Different operational requirements

## Currency and Configuration

Each Business Unit operates in a single currency with its own configuration. This is fundamental to how FlexPortal works.

### Example: USD Store vs EUR Store

A company selling the same laptop in US and Europe needs two Business Units:

| Setting             | US Store (USD)              | Europe Store (EUR) |
| ------------------- | --------------------------- | ------------------ |
| **Currency**        | USD                         | EUR                |
| **Monthly price**   | \$99                        | €89                |
| **Tax handling**    | Sales tax (varies by state) | VAT 21% (included) |
| **Payment account** | Stripe US                   | Stripe EU          |
| **Invoice format**  | US standard                 | EU VAT format      |
| **API key**         | `pk_live_us_...`            | `pk_live_eu_...`   |

Same product. Completely separate operations.

### Why Separate Business Units?

* **Currency is fixed** — cannot mix EUR and USD in one Business Unit
* **Tax rules differ** — VAT vs sales tax have different logic
* **Payment processors** — often require separate accounts per region
* **Reporting** — each BU has independent financial reports
* **Compliance** — different invoicing requirements per region

<Info>
  FlexPortal does not convert currencies. Each Business Unit operates entirely in its configured currency. Need USD and EUR? Create two Business Units.
</Info>

## Tax Configuration

Tax rules are configured per Business Unit to match local requirements.

### Tax Setup Examples

**Netherlands (VAT):**

* Default rate: 21% VAT
* Applied to all subscription payments
* VAT number required for business customers
* Reverse charge for EU business customers

**United States (Sales Tax):**

* Varies by state: 0% to 10%
* Configured per customer shipping address
* Nexus requirements per state
* Tax-exempt status for qualified organizations

**Dubai (VAT):**

* Standard rate: 5% VAT
* Applied to taxable supplies
* Zero-rated for certain categories
* TRN (Tax Registration Number) on invoices

## Payment Accounts

Each Business Unit connects to its own payment processor account.

### Stripe Integration (Coming Soon)

When Stripe integration launches, each Business Unit will connect to a separate Stripe account:

```
Netherlands BU → Stripe Account NL → EUR bank account
US BU → Stripe Account US → USD bank account
Dubai BU → Stripe Account AE → AED bank account
```

This ensures:

* Payments collected in the correct currency
* Compliance with local payment regulations
* Separate financial reporting per region
* Independent payout schedules

### Manual Payment Tracking (Current)

Currently, you manage payment collection externally and mark payments as paid in FlexPortal. Each Business Unit tracks its own payment records.

## API Access

Each Business Unit has separate API keys. Your integration specifies which Business Unit to access.

### API Key Format

```
pk_live_nl_abc123xyz  → Netherlands Business Unit
pk_live_us_def456uvw  → United States Business Unit
pk_live_ae_ghi789rst  → Dubai Business Unit
```

### Making API Calls

Include the API key for the specific Business Unit you want to access:

```bash theme={null}
# Create order in Netherlands BU
curl https://api-eu.flexportal.io/orders \
  -H "Authorization: Bearer pk_live_nl_abc123xyz" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "customer@example.nl",
    "items": [...]
  }'

# Create order in US BU
curl https://api-us.flexportal.io/orders \
  -H "Authorization: Bearer pk_live_us_def456uvw" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "customer@example.com",
    "items": [...]
  }'
```

<Warning>
  API keys cannot access data across Business Units. Using a Netherlands API key to access US Business Unit data will fail authentication.
</Warning>

## Dashboard Access

Users can be granted access to specific Business Units within the organization.

### User Permissions

| Access Level            | What They Can Do                                                              |
| ----------------------- | ----------------------------------------------------------------------------- |
| **Organization Admin**  | Access all Business Units, create new Business Units, manage billing          |
| **Business Unit Admin** | Full access to assigned Business Units only                                   |
| **Business Unit User**  | Limited access to assigned Business Units (view-only or specific permissions) |

**Example Setup:**

```
Emma (Organization Admin)
├── Can access: All Business Units
├── Can create: New Business Units
└── Can manage: Organization billing and users

James (BU Admin - Netherlands)
├── Can access: Netherlands BU only
├── Cannot access: US or Dubai BUs
└── Can manage: Products, orders, subscriptions in Netherlands

Sarah (BU Admin - United States)
├── Can access: US BU only
├── Cannot access: Netherlands or Dubai BUs
└── Can manage: Products, orders, subscriptions in US
```

## Creating a Business Unit

When you create a new Business Unit, you configure:

<Steps>
  <Step title="Basic Information" icon="building">
    Business Unit name, default language, timezone
  </Step>

  <Step title="Currency & Tax" icon="money-bill">
    Operating currency (cannot be changed later), default tax rate, tax ID
  </Step>

  <Step title="Payment Settings" icon="credit-card">
    Payment processor connection (Stripe, manual), bank details for invoices
  </Step>

  <Step title="API Access" icon="key">
    Generate API keys for this Business Unit
  </Step>
</Steps>

<Warning>
  Currency cannot be changed after Business Unit creation. Choose carefully based on your primary operating market.
</Warning>

## Real-World Examples

### Example 1: Regional Expansion

**DeviceFlow** started in the Netherlands and expanded to Belgium and Germany:

**Initial Setup:**

```
Organization: DeviceFlow
└── Business Unit: Netherlands (EUR)
    ├── Products: 100 items
    ├── Pricing: Standard EU pricing
    └── Tax: 21% VAT
```

**After Expansion:**

```
Organization: DeviceFlow
├── Business Unit: Netherlands (EUR)
│   ├── Tax: 21% VAT
│   └── Customers: Dutch market
├── Business Unit: Belgium (EUR)
│   ├── Tax: 21% VAT
│   └── Customers: Belgian market
└── Business Unit: Germany (EUR)
    ├── Tax: 19% VAT
    └── Customers: German market
```

Even though all three use EUR, they're separate Business Units because:

* Different VAT rates (Germany 19% vs others 21%)
* Different local regulations and invoicing requirements
* Separate operational teams per country
* Independent financial reporting

### Example 2: Brand Portfolio

**TechRent Group** operates multiple brands:

```
Organization: TechRent Group
├── Business Unit: TechRent Pro (USD)
│   ├── Target: Business customers
│   ├── Products: Enterprise laptops, workstations
│   ├── Pricing: \$150-300/month
│   └── Contract: 36-48 months
├── Business Unit: TechRent Home (USD)
│   ├── Target: Consumers
│   ├── Products: Consumer electronics
│   ├── Pricing: \$40-100/month
│   └── Contract: 12-24 months
└── Business Unit: TechRent Student (USD)
    ├── Target: Students
    ├── Products: Budget laptops, tablets
    ├── Pricing: \$25-60/month
    └── Contract: 9-12 months (academic year)
```

### Example 3: Test Environment

**FlexDevice** uses a separate Business Unit for testing:

```
Organization: FlexDevice
├── Business Unit: Production (EUR)
│   ├── Live customer data
│   ├── Real payment processing
│   └── Production API keys
└── Business Unit: Test (EUR)
    ├── Test customer data
    ├── Sandbox payment processing
    └── Test API keys
```

This allows safe testing without affecting production data.

## Reporting & Analytics

Each Business Unit has independent reporting:

| Report Type            | Scope                              |
| ---------------------- | ---------------------------------- |
| **Income Reports**     | Per Business Unit only             |
| **Cost Recovery**      | Assets and subscriptions within BU |
| **Customer Analytics** | Customers within BU                |
| **Payment Reports**    | Payments within BU                 |
| **Tax Reports**        | Tax collected within BU            |

Organization admins can view consolidated reports across all Business Units.

## Migration & Data Transfer

Business Units are permanent separations. You cannot:

* Move a customer from one Business Unit to another
* Transfer a subscription between Business Units
* Share products across Business Units
* Merge Business Units

If you need to migrate operations between Business Units, you must:

1. Create new orders in the target Business Unit
2. Activate new subscriptions with asset reassignment
3. End original subscriptions in the source Business Unit

<Info>
  Plan your Business Unit structure carefully before starting operations. Restructuring later requires manual data migration.
</Info>

## Next Steps

<CardGroup cols={2}>
  <Card title="Platform Overview" icon="diagram-project" href="/platform/overview">
    Understand how entities work within a Business Unit
  </Card>

  <Card title="API Reference" icon="code" href="/api-reference/overview">
    Learn how to authenticate and access specific Business Units via API
  </Card>
</CardGroup>
