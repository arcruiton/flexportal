> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Platform Overview

> Understand FlexPortal architecture and how core entities work together

FlexPortal is built around six core entities that work together to manage physical product subscriptions. Understanding how they relate helps you make the most of the platform.

## Core Entities

| Entity            | Purpose                                                                 | Example                                                                    |
| ----------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Products**      | Catalog items with pricing for different contract lengths               | MacBook Pro 14", Urban E-Bike, Ergonomic Office Chair                      |
| **Orders**        | Customer commitments to subscribe, containing items and billing details | Jane Smith orders a laptop, e-bike, or office chair on a 12-month contract |
| **Subscriptions** | Active contracts with assigned assets, generating recurring payments    | Order activated with serial number C02X1234ABCD                            |
| **Assets**        | Physical units tracked by serial number throughout their lifecycle      | Laptop with serial C02X1234ABCD currently with Jane Smith                  |
| **Customers**     | Individuals or businesses subscribing to products                       | Jane Smith, TechCorp BV                                                    |
| **Payments**      | Scheduled or completed billing transactions for subscriptions           | Monthly payment of \$89 due on Jan 15, 2025                                |

## How Entities Connect

The flow from product catalog to recurring income follows this path:

<Steps>
  <Step title="Product Catalog" icon="tag">
    Products are created with variants and pricing tiers for different contract lengths (6, 12, 24, 36 months). Each tier sets the monthly payment amount.
  </Step>

  <Step title="Order Placement" icon="cart-shopping">
    Customer selects a product variant and contract length. The order captures customer details, billing address, and commitment to subscribe.
  </Step>

  <Step title="Subscription Activation" icon="box-open">
    When an asset (identified by serial number) is assigned to an order item, the subscription becomes active. This creates the payment schedule.
  </Step>

  <Step title="Recurring Payments" icon="rotate">
    Payments generate automatically based on contract length and monthly price. Each payment contributes to cost recovery for the asset.
  </Step>
</Steps>

### Detailed Relationships

**Products → Orders → Subscriptions**

The flow is the same whether you offer laptops, e-bikes, office furniture, or baby strollers:

```
Product: MacBook Pro 14" - 512GB Space Gray
├─ Pricing: 12 months @ \$89/month
└─ Order #1234
   ├─ Customer: Jane Smith
   ├─ Item: MacBook Pro 14" - 512GB, 12 months
   └─ Subscription #5678
      ├─ Asset: Serial C02X1234ABCD
      ├─ Monthly payment: \$89
      ├─ Contract: 12 months starting Jan 1, 2025
      └─ Payments: 12 scheduled payments
```

**Assets Track Subscription History**

Each asset maintains its lifecycle history:

* When acquired and at what cost
* Current subscription assignment
* Previous subscriptions and customers
* Cost recovery percentage (income collected vs acquisition cost)
* Current condition and location

## Business Units

Business Units provide complete operational separation within your organization. Each Business Unit has:

| Separation           | What It Means                                            |
| -------------------- | -------------------------------------------------------- |
| **Currency**         | EUR in Netherlands, USD in United States, QAR in Qatar   |
| **Tax Rules**        | VAT for EU, Sales Tax for US, different rates per region |
| **Payment Accounts** | Separate Stripe accounts, separate bank accounts         |
| **Product Catalog**  | Different products, different pricing per market         |
| **API Keys**         | Isolated access, separate integrations                   |
| **Reporting**        | Independent dashboards and financial reports             |

### When to Use Multiple Business Units

Create separate Business Units for:

* **Different Countries** - Each with different currency and tax requirements
* **Different Brands** - Separate brands under one organization with different product catalogs
* **Different Business Lines** - Consumer vs business customers with different operational needs

<Info>
  Business Units are completely isolated. Products from one Business Unit cannot be ordered in another. Customers exist within a single Business Unit.
</Info>

## API-First Design

Every operation in FlexPortal is available through the REST API. The dashboard is built on the same API available to you.

### What You Can Do

* Create and manage products programmatically
* Accept orders from your own checkout or storefront
* Activate subscriptions and assign assets
* Track payments and update payment status
* Handle subscription lifecycle actions (extend, upgrade, buyout, return)
* Receive real-time webhooks for all state changes

### Integration Approach

FlexPortal integrates into your existing systems:

```
Your Storefront → FlexPortal API → Create Order
Your Warehouse → FlexPortal API → Assign Asset → Activate Subscription
FlexPortal Webhooks → Your System → Update Customer Record
Your Billing System → FlexPortal API → Mark Payment as Paid
```

## Data Flow Example

Here's how a typical subscription flows through the system:

<Steps>
  <Step title="Customer Places Order">
    Customer visits your website and selects a product (MacBook Pro 14", Urban E-Bike, or Standing Desk) on a 12-month contract. Your checkout sends order details to FlexPortal API.
  </Step>

  <Step title="Order Created">
    FlexPortal creates Order #1234 with status "Pending". It contains customer info, selected product variant, and contract terms.
  </Step>

  <Step title="Warehouse Assigns Asset">
    Your warehouse system calls FlexPortal API to activate the subscription with serial number C02X1234ABCD. Status changes to "Active".
  </Step>

  <Step title="Subscription Runs">
    FlexPortal generates 12 monthly payments of \$89. Tracks cost recovery as payments are marked paid. Asset tracks which customer has it.
  </Step>

  <Step title="Contract Ends">
    After 12 months, subscription status changes based on customer action: Extended, Upgraded, Bought Out, Returned, or Completed.
  </Step>
</Steps>

## Payment Flow

Payments represent scheduled or completed billing transactions:

| Payment Status | Meaning                         |
| -------------- | ------------------------------- |
| **Pending**    | Scheduled but not yet processed |
| **Paid**       | Successfully collected          |
| **Failed**     | Payment attempt unsuccessful    |
| **Cancelled**  | Voided before collection        |

FlexPortal generates the payment schedule but doesn't process payments directly. You integrate with your payment processor (Stripe, bank transfer, invoice) and mark payments as paid through the API.

<Info>
  Automated payment processing through Stripe is coming soon. Currently, you control when to mark payments as paid based on your collection method.
</Info>

## Cost Recovery Tracking

Unlike traditional subscription platforms that only track income, FlexPortal monitors profitability per asset.

**How It Works:**

1. Asset acquired for \$1,000 (acquisition cost)
2. Monthly payment: \$89
3. After Month 1: \$89 collected = 8.9% cost recovery
4. After Month 6: \$534 collected = 53.4% cost recovery
5. After Month 12: \$1,068 collected = 106.8% cost recovery (profitable)

Per-asset profitability tracking shows which products and contract lengths are profitable, when assets break even, and total lifetime value.

## Key Concepts

### Contract vs Subscription

* **Contract** refers to the legal terms and duration (12-month contract)
* **Subscription** refers to the active service relationship with the customer

Both describe the same entity in FlexPortal, but "contract" emphasizes duration while "subscription" emphasizes the ongoing relationship.

### Orders vs Subscriptions

* **Order** captures the customer's commitment to subscribe
* **Subscription** is the activated contract with an assigned asset

An order can have multiple items, each becoming a separate subscription when activated.

### Assets vs Products

* **Product** is the catalog item (iPhone 16 Pro, Urban E-Bike, Ergonomic Office Chair)
* **Asset** is the specific physical unit (serial number ABC123XYZ)

A single product can have hundreds of assets, each tracked individually.

## Next Steps

<CardGroup cols={2}>
  <Card title="Subscription Lifecycle" icon="rotate" href="/platform/subscription-lifecycle">
    Learn how subscriptions progress from order to completion
  </Card>

  <Card title="Cost Recovery" icon="chart-line" href="/platform/cost-recovery">
    Understand profitability tracking per asset
  </Card>

  <Card title="Business Units" icon="building" href="/platform/business-units">
    Set up multi-country or multi-brand operations
  </Card>

  <Card title="API Reference" icon="code" href="/api-reference/overview">
    Start building integrations
  </Card>
</CardGroup>
