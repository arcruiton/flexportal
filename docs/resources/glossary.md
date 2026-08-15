> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Glossary

> Key terms and definitions for FlexPortal

Key terms used throughout FlexPortal.

## Core Concepts

### Asset

A specific physical unit with a serial number. Each asset represents one physical device, piece of furniture, or item in your inventory.

### Product

The model or catalog item that customers subscribe to. A product defines the specifications, pricing, and subscription terms.

### Subscription

The service relationship between your business and the customer. A subscription has a status, contract terms, and lifecycle events.

### Contract

The legal terms and duration of the subscription. Contract length is specified in months (6, 12, 24, 36).

## Business Structure

### Business Unit

An isolated setup with its own currency, tax rules, payment account, product catalog, API keys, and reporting. Used for separating countries, brands, or business lines.

### Billing Group

A way to consolidate multiple subscriptions under one invoice for business customers. A company with 50 laptop subscriptions can receive one combined invoice instead of 50 separate ones.

### Organization

The top-level account that owns one or more Business Units. Billing and user management happen at the organization level.

## Pricing Terms

### List Price

The full retail price of a product if purchased outright, not as a subscription.

### Acquisition Cost

The cost you paid to acquire the asset. Used to calculate cost recovery and profitability.

### Monthly Payment

The amount the customer pays per month for the subscription.

### Buyout Price

The amount a customer pays to purchase the asset and end the subscription.

### Platform Fee

Percentage of subscription income processed through FlexPortal. Excludes taxes, refunds, and chargebacks. Separate from payment processing fees.

## Financial Terms

### Income

Money collected from subscriptions. Monthly income, recurring income, subscription income.

### Cost Recovery

The percentage of an asset's acquisition cost recovered through subscription payments. Ranges from 0% (newly deployed) to 100% (breakeven) and beyond (profitable).

## Customer Types

### Customer

Any person or business using your subscription service.

### Subscriber

Someone with an active subscription.

### Business Customer

A company or organization that subscribes to products, often with consolidated billing through Billing Groups.

## Subscription Lifecycle

### Subscription Status

* **Active** — Subscription is running
* **Cancelled** — Terminated by admin
* **Bought Out** — Customer purchased the asset
* **Early Return** — Asset returned before contract end
* **Upgraded** — Customer moved to new product
* **Completed** — Contract ended naturally

### Extend

Add months to an existing subscription with the same asset.

### Upgrade

End the current subscription and create a new one with a different product. Customer returns old asset, receives new one.

### Replace

Swap to a different asset of the same product model. Used when a device is damaged or defective. Same subscription continues.

### Buyout

Customer purchases the asset outright, ending the subscription.

### Early Return

Customer returns the asset before the contract ends. May involve a fee.

## Asset Management

### Asset Status

* **Available** — Ready to be assigned to a subscription
* **Rented Out** — Currently assigned to an active subscription
* **Returned** — Returned by customer, pending inspection
* **Sold** — Purchased by customer via buyout
* **In Repair** — Being repaired
* **Retired** — Permanently removed from circulation
* **Lost** — Asset lost or stolen

### Return Condition

Condition of an asset when returned:

* **Excellent** — Like new
* **Good** — Minor wear, fully functional
* **Fair** — Noticeable wear, fully functional
* **Poor** — Heavy wear
* **Damaged** — Requires repair

## Payment Terms

### Payment Status

* **Pending** — Awaiting payment
* **Paid** — Completed
* **Failed** — Unsuccessful
* **Cancelled** — Voided

### Net Terms

Payment due within a specified number of days. Net 7, Net 14, Net 30.

### Fee

Charges for specific actions: early return fee, late fee, damage fee.

## Platform Terms

### API Key

Authentication token for accessing the FlexPortal API. Generated in Settings.

### Webhook

Real-time event notification sent to your system when events occur (subscription activated, payment received, asset returned).

### Region

FlexPortal operates in multiple regions with separate API endpoints: EU, US, Qatar.
