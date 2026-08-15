> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Shopify Integration

> Sync products and capture subscription orders from your Shopify store

<Info>
  **Coming Soon** — Shopify integration is currently in development. Sign up for updates at [flexportal.io](https://flexportal.io)
</Info>

The Shopify integration will connect your Shopify storefront with FlexPortal to sync products, capture subscription orders, and manage inventory seamlessly.

## What Shopify Integration Will Enable

<CardGroup cols={2}>
  <Card title="Product Sync" icon="sync">
    Automatically sync products between Shopify and FlexPortal
  </Card>

  <Card title="Subscription Orders" icon="cart-shopping">
    Capture subscription orders directly from your Shopify checkout
  </Card>

  <Card title="Inventory Management" icon="boxes-stacked">
    Track asset availability and sync inventory status
  </Card>

  <Card title="Customer Data" icon="users">
    Sync customer information between platforms automatically
  </Card>
</CardGroup>

## Key Features

### Product Sync

* Two-way sync between Shopify products and FlexPortal catalog
* Map product variants to subscription options
* Sync pricing, images, and descriptions
* Control which products are available as subscriptions

### Checkout Integration

* Add subscription options to Shopify product pages
* Display contract lengths (6, 12, 24, 36 months) at checkout
* Calculate and show monthly payments
* Present end-of-term options (buyout, return, extend)

### Order Processing

* Automatically create FlexPortal subscriptions from Shopify orders
* Generate subscription contracts for customer signature
* Trigger fulfillment workflows when contracts are signed
* Sync order status between platforms

### Inventory & Assets

* Real-time inventory sync based on asset availability
* Update Shopify inventory when assets are rented out
* Mark products as available when assets are returned
* Track serial numbers for order fulfillment

## Current State: Manual Product Entry

Today, you manage products separately in each platform:

**In FlexPortal:**

```javascript theme={null}
// Create products manually via API or dashboard
const product = await flexportal.products.create({
  name: 'iPhone 16 Pro 256GB',
  list_price: 1299,
  monthly_payment: 49.99,
  contract_lengths: [12, 24, 36]
});
```

**In Shopify:**

* Create products in Shopify admin
* Use FlexPortal API to create orders when customers purchase subscriptions
* Manually keep product catalogs in sync

## Future State: Automated Sync

With Shopify integration:

<Steps>
  <Step title="Connect Shopify Store" icon="link">
    One-click connection between Shopify and FlexPortal
  </Step>

  <Step title="Map Products" icon="map">
    Choose which Shopify products to offer as subscriptions
  </Step>

  <Step title="Configure Subscription Options" icon="sliders">
    Set contract lengths, monthly payments, and end-of-term options per product
  </Step>

  <Step title="Orders Flow Automatically" icon="arrows-rotate">
    Shopify orders automatically create FlexPortal subscriptions
  </Step>

  <Step title="Inventory Stays in Sync" icon="check">
    Asset availability updates Shopify inventory in real-time
  </Step>
</Steps>

## How Customers Will Experience It

### On Your Shopify Store

1. Browse products with subscription pricing displayed
2. Choose contract length at checkout (12, 24, or 36 months)
3. See monthly payment amount and total contract value
4. Complete purchase through Shopify checkout

### After Purchase

1. Order automatically creates subscription in FlexPortal
2. Customer receives contract to sign electronically
3. Once signed, fulfillment workflow triggers
4. Product ships with tracked serial number
5. Subscription activates with first payment

### During Subscription

1. Recurring payments processed (manual or via Stripe)
2. Customer manages subscription in FlexPortal dashboard
3. Request extensions, upgrades, or early returns
4. End-of-term options presented automatically

## Supported Features

| Feature                  | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| **Product Sync**         | Two-way sync of products, variants, pricing, and images |
| **Order Capture**        | Subscription orders flow from Shopify to FlexPortal     |
| **Inventory Management** | Asset availability updates Shopify stock levels         |
| **Customer Sync**        | Customer data synchronized between platforms            |
| **Contract Generation**  | Automatic contract creation for Shopify orders          |
| **Fulfillment Triggers** | Notify fulfillment when contracts are signed            |
| **Asset Tracking**       | Link Shopify orders to specific asset serial numbers    |

## Pricing

Shopify integration is included at no additional cost for FlexPortal customers. Standard Shopify and FlexPortal pricing applies.

## Migration Path

Already selling on Shopify? We'll help you:

* Import existing Shopify products to FlexPortal
* Map product variants to subscription options
* Set up subscription pricing and contract terms
* Configure checkout flow and contract generation
* Test end-to-end workflow before going live

## Use Cases

### Electronics Retailer

Sell iPhones, laptops, and tablets with flexible subscription terms. Sync inventory across platforms so customers see real-time availability.

### Furniture Company

Offer home and office furniture as subscriptions. Sync product catalogs and handle contract lengths based on furniture type.

### Baby Gear Subscriptions

List strollers, car seats, and cribs on Shopify. Automatically create subscriptions with age-based contract lengths.

### Mobility Equipment

E-bikes, scooters, and bikes available as subscriptions. Track serial numbers for fulfillment and returns.

## Get Notified

Want early access when Shopify integration launches?

<Card title="Sign Up for Updates" icon="bell" href="https://www.flexportal.io">
  Get notified when Shopify integration is available
</Card>

## Questions?

### Will existing Shopify products sync automatically?

You'll choose which products to offer as subscriptions and map them to FlexPortal. Not all products need to be subscriptions.

### Can I offer both purchase and subscription options?

Yes. Customers can choose between one-time purchase or subscription at checkout.

### What happens to existing Shopify orders?

Existing orders stay in Shopify. The integration handles new subscription orders going forward.

### Do I need Shopify Plus?

No. The integration works with all Shopify plans (Basic, Shopify, Advanced, Plus).

### Can I customize the checkout experience?

Yes. Configure contract lengths, pricing display, end-of-term options, and checkout messaging.

## Alternative: Use the API Today

You can integrate FlexPortal with Shopify today using our API:

1. Create products in both Shopify and FlexPortal
2. Use Shopify webhooks to detect new orders
3. Create FlexPortal subscriptions via API when subscription orders come through
4. Update Shopify inventory based on FlexPortal asset availability

<Card title="API Reference" icon="code" href="/api-reference/orders/create">
  Learn how to create orders via API
</Card>

## Development Roadmap

<Steps>
  <Step title="Phase 1: Product Sync" icon="1">
    Two-way product and inventory synchronization
  </Step>

  <Step title="Phase 2: Order Capture" icon="2">
    Subscription orders flow from Shopify checkout to FlexPortal
  </Step>

  <Step title="Phase 3: Customer Portal" icon="3">
    Embedded customer portal for managing subscriptions
  </Step>

  <Step title="Phase 4: Analytics" icon="4">
    Unified reporting across Shopify and FlexPortal
  </Step>
</Steps>
