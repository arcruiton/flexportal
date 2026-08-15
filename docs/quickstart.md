> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Quickstart

> Create your first subscription in 10 minutes

This guide walks you through creating your first active subscription. You'll create a product, place an order, and activate a subscription by assigning an asset. By the end, you'll have a working subscription generating recurring revenue.

## Prerequisites

A FlexPortal account — [sign up at www.flexportal.io/pricing](https://www.flexportal.io/pricing).

<Info>
  Create a Business Unit named "Test" to learn the platform. When you're ready for production, create another Business Unit and copy settings from your test setup.
</Info>

## The Flow

FlexPortal follows four steps:

1. **Products** — Create items in your catalog with variants and pricing
2. **Orders** — Create an order for a customer with products and contract length
3. **Subscriptions** — Activate by assigning a serial number (asset) to the order
4. **Active** — Subscription runs, payments generate automatically

## Step 1: Create a Product

Products are items in your catalog. Each product can have variants with different pricing for different contract lengths.

1. Log in to the [FlexPortal Dashboard](https://eu.flexportal.io)
2. Navigate to **Products** in the left sidebar
3. Click **New Product** in the top right
4. Enter the product details:
   * **Name**: Urban Commuter E-Bike
   * **SKU**: ECB-250W
   * **Category**: Mobility
   * **Brand**: CityRide
   * **Specification**: 250W motor, 60km range, 7-speed
5. Scroll to the **Variants** section and click **Add Variant**
6. Configure the variant:
   * **Variant name**: Matte Black
   * **Grade**: A
7. Add pricing for the variant:
   * **Contract length**: 24 months
   * **Monthly price**: 59.00
8. Click **Save**

<Info>
  You can add multiple pricing tiers for different contract lengths (6, 12, 24, 36 months). Customers select their preferred term when ordering.
</Info>

## Step 2: Create an Order

Orders represent a customer's commitment to subscribe. They contain customer information, billing details, and the products being subscribed to.

1. Click **Orders** in the left sidebar
2. Click **New Order** in the top right
3. Enter customer information:
   * **Email**: [emma.larsson@example.com](mailto:emma.larsson@example.com)
   * **First name**: Emma
   * **Last name**: Larsson
   * **Customer type**: Individual
4. Scroll to **Order Items** and click **Add Item**
5. Configure the order item:
   * **Product**: Select "Urban Commuter E-Bike"
   * **Variant**: Select "Matte Black"
   * **Contract length**: 24 months
   * **Quantity**: 1
6. Scroll to **Billing Address** and enter:
   * **Street address**: Storgatan 15
   * **City**: Stockholm
   * **Postal code**: 111 29
   * **Country**: Sweden
7. Click **Save Order**

The order is created with status "Pending". The Order ID appears at the top left.

<Warning>
  An order must have at least one item and a complete billing address before it can be saved.
</Warning>

## Step 3: Activate the Subscription

To activate a subscription, assign a physical asset (identified by serial number) to an order item. This starts the subscription and billing cycle.

1. From the order you just created, scroll to the **Items** section
2. Find the Urban Commuter E-Bike item
3. Click **Create Subscription** next to the item
4. In the dialog, enter:
   * **Serial number**: ECB-2024-00142
   * **Start date**: Leave as today (or select a future date)
5. Click **Create**

The subscription is now active. Status changes to "Active" and a subscription ID appears.

<Info>
  FlexPortal automatically generates the first payment and schedules recurring monthly payments based on the contract length.
</Info>

## Step 4: View Your Subscription

1. Navigate to **Subscriptions** in the left sidebar
2. Your newly created subscription appears in the list

The subscription details show:

* **Customer**: Emma Larsson ([emma.larsson@example.com](mailto:emma.larsson@example.com))
* **Product**: Urban Commuter E-Bike - Matte Black
* **Serial number**: ECB-2024-00142
* **Monthly payment**: 59.00
* **Contract period**: 24 months from start date
* **Cost recovery**: Percentage of asset value recovered through payments
* **Next payment date**: One month from start

Click on the subscription to view:

* Payment schedule and history
* Asset information
* Contract terms
* Available actions (extend, upgrade, replace, buyout, early return)

<Info>
  The e-bike example shown is illustrative. FlexPortal supports any physical product with flexible configurations for pricing, contract lengths, and terms.
</Info>

## What You've Accomplished

You now have a complete subscription workflow:

* A product in your catalog (Urban Commuter E-Bike)
* A customer order for Emma Larsson
* An active subscription with assigned asset ECB-2024-00142
* Recurring billing generating 59.00 monthly for 24 months

After the contract ends, you can offer options to extend, upgrade, purchase the asset, or return it.

## Subscription Statuses

As subscriptions progress, you'll see these statuses:

| Status           | Meaning                                        |
| ---------------- | ---------------------------------------------- |
| **Active**       | Subscription running, payments being generated |
| **Cancelled**    | Terminated early by admin                      |
| **Bought Out**   | Customer purchased the asset                   |
| **Upgraded**     | Customer moved to a new subscription           |
| **Early Return** | Asset returned before contract end             |
| **Completed**    | Contract ended naturally                       |

## Next Steps

<CardGroup cols={2}>
  <Card title="Subscription Lifecycle" icon="rotate" href="/platform/subscription-lifecycle">
    Learn about extensions, upgrades, buyouts, and returns
  </Card>

  <Card title="Cost Recovery" icon="chart-line" href="/platform/cost-recovery">
    Track profitability per asset
  </Card>

  <Card title="Asset Management" icon="box" href="/operations/assets">
    Manage your physical inventory
  </Card>

  <Card title="Business Units" icon="building" href="/platform/business-units">
    Set up multiple markets or brands
  </Card>
</CardGroup>

## Using the API

To integrate FlexPortal into your applications:

<Card title="API Reference" icon="code" href="/api-reference/overview">
  Complete API documentation for products, orders, subscriptions, and more
</Card>
