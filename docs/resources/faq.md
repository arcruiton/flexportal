> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Frequently Asked Questions

> Common questions about FlexPortal

Find answers to common questions about FlexPortal's subscription platform for physical products.

## General

### What is FlexPortal?

FlexPortal is a subscription management platform built specifically for physical products. It handles the complete subscription lifecycle: from order creation and asset tracking to recurring billing, contract extensions, upgrades, and end-of-term options.

Unlike general subscription platforms, FlexPortal tracks each physical asset by serial number, manages contract terms, monitors cost recovery, and handles the complexity of physical product subscriptions — returns, replacements, buyouts, and upgrades.

### Who is FlexPortal for?

FlexPortal serves two types of businesses:

**Brands Adding Subscriptions** — You sell physical products and want to build recurring income. FlexPortal lets you offer subscriptions alongside traditional sales.

**Subscription-First Businesses** — You already run a subscription business but need better tools. FlexPortal replaces spreadsheets and fragmented systems with one platform for billing, asset tracking, contract management, and profitability analysis.

### What types of products work with FlexPortal?

FlexPortal works for any physical product across any industry:

* **Electronics** - MacBook Pro 14, iPhone 15 Pro, 4K monitors
* **Mobility** - Urban e-bikes, cargo bikes, e-scooters
* **Furniture** - Ergonomic office chairs, standing desks, conference tables
* **Baby & Kids** - Premium strollers, convertible car seats
* **Appliances** - Commercial coffee machines, air purifiers
* **Medical** - Electric wheelchairs, patient monitors

If it's a physical product that can be offered as a subscription, FlexPortal can manage it.

## Pricing & Business Model

### How does FlexPortal pricing work?

FlexPortal charges a platform fee as a percentage of subscription income processed through the platform. The platform fee excludes taxes, refunds, and chargebacks.

Platform fees are separate from payment processing fees (e.g., Stripe charges 2.9% + 30¢ per transaction).

**Example:** If you collect \$10,000 in monthly subscription income and your platform fee is 5%, you pay \$500 to FlexPortal.

### What pricing tiers are available?

FlexPortal offers three pricing tiers with decreasing platform fees:

| Tier           | Best For                           | Platform Fee                     |
| -------------- | ---------------------------------- | -------------------------------- |
| **Starter**    | Getting started with subscriptions | Higher fee, lower commitment     |
| **Growth**     | Scaling subscription operations    | Lower fee, better unit economics |
| **Enterprise** | Large operations with custom needs | Lowest fee, volume discounts     |

**Why upgrade?** As your subscription volume grows, a lower percentage fee makes a significant difference. A business processing \$50,000/month saves substantially on Growth vs Starter — often enough to pay for the tier upgrade many times over.

Contact sales for specific pricing details.

### Is there a free trial?

Yes, FlexPortal offers a 30-day money-back guarantee. Try the platform risk-free for 30 days.

## Products vs Assets

### What's the difference between a Product and an Asset?

**Product** — The model or catalog item (e.g., "iPhone 16 Pro 256GB", "Urban E-Bike 250W", "Ergonomic Office Chair"). This is what customers see and subscribe to.

**Asset** — A specific physical unit with a serial number. Each asset represents one physical device in your inventory.

**Examples:**

* You have one Product called "iPhone 16 Pro 256GB" but 50 Assets of that product, each with its own serial number
* One Product "Urban E-Bike" but 30 Assets, each with its unique frame number
* One Product "Ergonomic Office Chair" but 100 Assets, each tracked individually

### Why do I need to track assets separately?

Tracking assets by serial number enables:

* Know which customer has which specific device
* Monitor asset condition (excellent, good, fair, damaged)
* Calculate cost recovery per asset (how much you've recovered vs acquisition cost)
* Handle replacements, returns, and upgrades accurately
* Manage inventory and availability in real-time

### Can one subscription have multiple assets?

No. Each subscription is tied to one asset. If a business customer subscribes to 50 laptops, that's 50 separate subscriptions (which can be consolidated into one Billing Group for invoicing).

## Business Units

### What is a Business Unit?

A Business Unit is an isolated setup with its own:

* Currency and tax rules
* Payment account (e.g., Stripe)
* Product catalog
* API keys
* Reporting and analytics

Business Units are useful for separating countries, brands, or business lines.

### When should I use multiple Business Units?

Use multiple Business Units when you need to:

* **Operate in different countries** — US operations in USD, European operations in EUR
* **Manage multiple brands** — Separate product catalogs and branding per brand
* **Different payment processors** — Different Stripe accounts per region
* **Separate reporting** — Keep analytics and income tracking isolated per business line

### Can customers access multiple Business Units?

No. Each customer exists within one Business Unit. If you operate globally, a customer in the US and a customer in Europe would be in different Business Units.

## Integration & API

### Can I integrate FlexPortal with my existing systems?

Yes. FlexPortal is API-first. Every feature is accessible through our REST API. You can:

* Automate subscription workflows
* Build custom integrations
* Sync data with existing systems
* Create tailored customer experiences

<Card title="API Reference" icon="code" href="/api-reference/overview">
  Explore the complete FlexPortal API
</Card>

### What integrations are available?

**Currently Available:**

* Full REST API for all operations
* Webhooks for real-time events

**Coming Soon:**

* **Stripe** — Automated recurring payments
* **Shopify** — Product sync and order capture

### Can I use FlexPortal with Shopify?

Yes. You can integrate FlexPortal with Shopify today using the API:

1. Create products in both Shopify and FlexPortal
2. Use Shopify webhooks to detect new orders
3. Create FlexPortal subscriptions via API when subscription orders come through

A native Shopify integration with automatic product sync and order capture is coming soon.

### Does FlexPortal process payments?

Not currently. FlexPortal generates scheduled payments that you mark as paid after processing through your own payment system.

**Coming Soon:** Stripe integration will enable automated recurring payment processing.

## Subscription Lifecycle

### What happens at the end of a contract?

When a contract ends, customers typically have these options:

1. **Return** — Send the asset back
2. **Buyout** — Purchase the asset at the buyout price
3. **Upgrade** — Trade in for a new product with a new subscription
4. **Extend** — Add more months to continue using the same asset

You control which options are available to customers.

### What's the difference between Extend and Upgrade?

**Extend** — Adds months to an existing subscription. Same device, longer term.

* Example: Customer with a 12-month laptop contract adds 6 more months. Same MacBook, 18 total months.

**Upgrade** — Ends current subscription and creates a new one with a new device. Customer returns old device and receives a new one.

* Examples:
  * Customer upgrades from iPhone 15 to iPhone 16
  * Customer upgrades from standard e-bike to premium model
  * Customer upgrades from basic office chair to executive model

### Can customers cancel subscriptions early?

Yes, but terms depend on your contract settings:

* **Early Return** — Customer returns the asset before contract end, may pay an early return fee
* **Buyout** — Customer purchases the asset outright, ending the subscription

You configure early return fees and buyout pricing based on remaining contract length.

### How do I handle damaged or defective devices?

Use the **Replace Device** action to swap to a different asset of the same product model.

**Examples:**

* Laptop is damaged: Customer receives a replacement MacBook of the same model with a different serial number
* E-bike has mechanical issues: Replace with another e-bike, subscription continues seamlessly
* Office chair damaged in transit: Ship replacement chair, update subscription with new serial number

## Billing & Payments

### How does recurring billing work?

FlexPortal generates scheduled payments based on your billing frequency (monthly, quarterly, annual). You process payments through your own system and mark them as paid in FlexPortal.

**Coming Soon:** Stripe integration will automatically charge customers on their billing cycle.

### Can I offer different contract lengths?

Yes. Common contract lengths are 6, 12, 24, and 36 months. You can set available contract lengths per product.

### What are Billing Groups?

Billing Groups consolidate multiple subscriptions under one invoice for business customers.

**Example:** A company subscribes to 50 laptops. Instead of 50 separate invoices, all subscriptions bill to one Billing Group with one consolidated invoice.

### Can I prorate payments?

Yes. FlexPortal supports three first payment options:

* **Full Month** — Pay for the first full month today
* **Partial Month** — Only pay for the remaining days this month
* **Free Until Cycle** — No charge until the billing cycle starts

For mid-cycle upgrades or extensions, you can calculate prorated amounts.

## Asset Tracking

### How do I track cost recovery?

FlexPortal automatically calculates cost recovery as a percentage of the asset's acquisition cost.

**Example:**

* Acquisition cost: \$1,000
* Collected so far: \$600
* Cost recovery: 60%

Cost recovery helps you understand:

* When each asset breaks even (100% cost recovery)
* Which assets are profitable (over 100% cost recovery)
* Financial health of your subscription portfolio

### What asset statuses are available?

FlexPortal uses specific statuses (never vague "unavailable"):

* **Available** — Ready to be assigned to a subscription
* **Rented Out** — Currently assigned to an active subscription
* **In Repair** — Being repaired, temporarily unavailable
* **Retired** — Permanently removed from circulation
* **Lost** — Asset lost or stolen
* **Returned** — Asset returned by customer, pending inspection

### How do I handle returns?

When customers return assets, record the return condition:

* **Excellent** — Like new, no visible wear
* **Good** — Minor wear, fully functional
* **Fair** — Noticeable wear, fully functional
* **Poor** — Heavy wear, may have issues
* **Damaged** — Requires repair

Return condition helps you decide whether to:

* Make the asset available again
* Send for repair
* Retire the asset
* Charge damage fees

## Security & Data

### How is customer data protected?

FlexPortal follows industry-standard security practices:

* All data transmitted over HTTPS
* API authentication via Bearer tokens
* Business Unit isolation (customers can't access data from other Business Units)
* Role-based access control for team members

### Where is data stored?

FlexPortal operates in multiple regions:

* **EU** (Europe)
* **US** (United States)
* **Qatar** (Middle East)

When you create a Business Unit, choose the region closest to your operations for optimal performance.

### Can I export my data?

Yes. FlexPortal provides API endpoints to export:

* Subscriptions
* Customers
* Assets
* Payments
* Products

You can also generate CSV exports for reporting and analysis.

## Support & Resources

### How do I get help?

**Documentation** — This documentation site covers all platform features and API endpoints.

**Email Support** — [support@flexportal.io](mailto:support@flexportal.io)

**API Playground** — Test API requests directly in the documentation before implementing.

### Do you offer onboarding or training?

Yes. Enterprise customers receive dedicated onboarding and training. Contact sales for details.

### Can you help with custom integrations?

Yes. We provide integration support for Enterprise customers. Contact us at [support@flexportal.io](mailto:support@flexportal.io) to discuss your integration needs.

## Getting Started

### How do I get started with FlexPortal?

<Steps>
  <Step title="Sign Up" icon="user-plus">
    Create your FlexPortal account and set up your first Business Unit
  </Step>

  <Step title="Add Products" icon="box">
    Create your product catalog with pricing and contract terms
  </Step>

  <Step title="Import Assets" icon="barcode">
    Add physical assets with serial numbers to your inventory
  </Step>

  <Step title="Create Subscriptions" icon="rocket">
    Start creating subscriptions via dashboard or API
  </Step>
</Steps>

<CardGroup cols={2}>
  <Card title="Quickstart Guide" icon="rocket" href="/quickstart">
    Make your first API call in 5 minutes
  </Card>

  <Card title="API Reference" icon="code" href="/api-reference/overview">
    Complete API documentation
  </Card>
</CardGroup>

### What if I have a question not listed here?

Contact us at [support@flexportal.io](mailto:support@flexportal.io). We're happy to help answer any questions about FlexPortal.
