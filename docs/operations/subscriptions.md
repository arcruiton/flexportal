> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Subscriptions

> Handle active subscriptions and their lifecycle

Subscriptions are the core of FlexPortal. Each subscription represents a customer using a specific asset under contract. Subscriptions generate recurring payments and track cost recovery over time.

## Subscription Overview

A subscription includes:

* Customer information
* Physical asset (identified by serial number)
* Product and variant details
* Contract terms (length, monthly payment)
* Payment schedule and history
* Cost recovery tracking

## Viewing Subscriptions

Navigate to **Subscriptions** in the left sidebar to see all subscriptions.

The list shows:

* Customer name
* Product and variant
* Status (Active, Cancelled, etc.)
* Monthly payment amount
* Contract end date
* Cost recovery percentage

Click any subscription to view full details.

## Subscription Statuses

Subscriptions progress through different statuses based on their lifecycle:

### Active Statuses

| Status     | Description                                       |
| ---------- | ------------------------------------------------- |
| **Active** | Subscription is running, payments being generated |

### Ended Statuses

| Status               | Display Label    | Description                                   |
| -------------------- | ---------------- | --------------------------------------------- |
| `ended_completed`    | **Completed**    | Contract finished, customer returned asset    |
| `ended_buyout`       | **Bought Out**   | Customer purchased the asset                  |
| `ended_upgrade`      | **Upgraded**     | Customer upgraded to a different product      |
| `ended_early_return` | **Early Return** | Customer returned asset before contract ended |
| `cancelled`          | **Cancelled**    | Subscription terminated by admin              |

<Info>
  Ended subscriptions remain in the system for record keeping. They show complete payment history and final cost recovery.
</Info>

## Filtering Subscriptions

Use filters to find specific subscriptions:

### Filter by Status

* Active
* Completed
* Bought Out
* Upgraded
* Early Return
* Cancelled

### Filter by Date

* Contract start date
* Contract end date
* Created date

### Search

Search by:

* Customer name or email
* Product name
* Serial number
* Subscription ID

## Subscription Actions

Active subscriptions have several actions available to handle the lifecycle from start to finish.

### Extend

Add months to the existing subscription. Same asset, same monthly rate.

1. Open an active subscription
2. Click **Extend** in the top right
3. Enter:
   * **Additional months** - How many months to add (e.g., 6, 12)
   * **New monthly rate** - Keep current rate or update
4. Click **Extend Subscription**

The contract end date extends by the additional months. New payments are generated for the extension period.

<Tip>
  Use Extend when customers want to continue using the same asset. This is simpler than creating a new subscription.
</Tip>

### Upgrade

Move customer to a different product. Creates a new subscription and ends the current one.

1. Open an active subscription
2. Click **Upgrade** in the top right
3. Select:
   * **New product** - The product to upgrade to
   * **New variant** - Specific variant
   * **Contract length** - Duration for new subscription
   * **Start date** - When new subscription begins
4. Enter:
   * **New serial number** - Asset for the new subscription
   * **Buyout amount** - Price for old asset (optional)
5. Click **Create Upgrade**

The current subscription ends with status "Upgraded". A new subscription is created for the new product.

<Warning>
  The old asset must be returned or bought out. Set the buyout amount if the customer is purchasing the old asset.
</Warning>

### Replace Device

Swap the current asset for a different unit of the same product while the subscription continues unchanged.

1. Open an active subscription
2. Click **Replace Device** in the top right
3. Enter:
   * **New serial number** - The replacement asset
   * **Reason** - Why device is being replaced (damage, defect, etc.)
4. Click **Replace**

The subscription continues with the new asset. Monthly payments remain the same.

Use this when:

* Asset is damaged and needs replacement
* Customer prefers different color/configuration
* Asset has defects

### Buyout

Customer purchases the asset, ending the subscription and transferring ownership.

1. Open an active subscription
2. Click **Buyout** in the top right
3. Enter:
   * **Buyout price** - Amount customer pays to own the asset
   * **Payment date** - When buyout payment is received
4. Click **Process Buyout**

Subscription status changes to "Bought Out". The asset status changes to "Sold". No more payments are generated.

<Info>
  Buyout price is typically the remaining asset value minus income already collected. Set your own buyout pricing policy.
</Info>

### Early Return

Customer returns the asset before the contract ends.

1. Open an active subscription
2. Click **Early Return** in the top right
3. Enter:
   * **Return date** - When asset is returned
   * **Condition** - Asset condition (Excellent, Good, Fair, Poor, Damaged)
   * **Early return fee** - Fee charged for early termination (optional)
4. Click **Process Return**

Subscription status changes to "Early Return". Asset status changes to "Returned" and becomes available for new subscriptions.

<Tip>
  Set early return fees to discourage early termination or cover remaining cost recovery. This is configurable per subscription.
</Tip>

### Cancel Subscription

Admin-initiated cancellation. Use sparingly.

1. Open an active subscription
2. Click **Cancel** in the top right
3. Enter:
   * **Cancellation reason** - Why subscription is being cancelled
   * **Effective date** - When cancellation takes effect
4. Confirm cancellation

Subscription status changes to "Cancelled". Future payments are not generated. The asset should be returned.

<Warning>
  Cancellation is permanent. Use Early Return instead if the customer is returning the asset voluntarily.
</Warning>

## Payment History

View all payments for a subscription:

1. Open the subscription
2. Scroll to the **Payments** section

Payment history shows:

* Payment date
* Amount
* Status (Pending, Paid, Failed, Cancelled)
* Payment method
* Invoice link

Click any payment to view details or mark as paid.

Learn more in [Payment Management](/operations/payments).

## Cost Recovery Tracking

Cost recovery shows what percentage of the asset's acquisition cost has been recovered through subscription income.

### How Cost Recovery Works

```
Cost Recovery = (Total Income Collected / Asset Acquisition Cost) × 100%
```

Example:

* Asset cost: \$1,200
* Monthly payment: \$89
* After 6 months: \$534 collected
* Cost recovery: 44.5%

After 14 months: \$1,246 collected = 103.8% cost recovery

<Info>
  Cost recovery above 100% means the asset is generating profit. Below 100% means you haven't recovered the full asset cost yet.
</Info>

### Viewing Cost Recovery

The subscription detail page shows:

* **Current cost recovery percentage**
* **Total income collected**
* **Remaining to 100%** (if under 100%)

Track this to understand asset profitability over time.

## Contract End Dates

Every subscription has a contract end date based on the start date and contract length (6, 12, 24, or 36 months). The end date appears prominently on the subscription detail page.

### What Happens When Contracts End

When a contract ends, customers typically have these options:

* Return the asset (subscription ends as "Completed")
* Buy out the asset (subscription ends as "Bought Out")
* Extend for additional months (subscription continues as "Active")
* Upgrade to a new product (subscription ends as "Upgraded")

<Tip>
  Set reminders to contact customers 30 days before contract ends to discuss their options.
</Tip>

## Subscription Timeline

The subscription timeline shows all lifecycle events:

* Subscription created
* Payments generated
* Payments received
* Actions taken (extensions, replacements)
* Status changes
* Contract end

This provides a complete audit trail for the subscription.

## Viewing Subscription Details

The subscription detail page includes:

### Customer Information

* Name and email
* Customer type (Individual or Business)
* Contact details

### Asset Information

* Serial number
* Product and variant
* Asset status
* Asset location

### Contract Terms

* Start date
* Contract length
* End date
* Monthly payment
* Total contract value

### Financial Summary

* Total income collected
* Cost recovery percentage
* Next payment date
* Outstanding balance

### Payment Schedule

* All scheduled payments
* Payment status for each period
* Total expected income over contract

## Common Scenarios

### Customer Wants to Keep Asset Longer

Use **Extend**:

1. Discuss additional months with customer
2. Click Extend
3. Add 6 or 12 months
4. Confirm new monthly rate
5. Save extension

### Customer Wants to Upgrade

Use **Upgrade**:

1. Customer selects new product
2. Click Upgrade
3. Choose new product and contract length
4. Assign new serial number
5. Process upgrade
6. Arrange return or buyout of old asset

### Asset Needs Replacement

Use **Replace Device**:

1. Identify replacement asset
2. Click Replace Device
3. Enter new serial number
4. Document reason for replacement
5. Arrange logistics for device swap

### Customer Wants to Own the Device

Use **Buyout**:

1. Calculate buyout price
2. Click Buyout
3. Enter buyout amount
4. Confirm payment received
5. Process buyout
6. Transfer ownership to customer

### Customer Returns Early

Use **Early Return**:

1. Customer requests early return
2. Calculate early return fee (if applicable)
3. Click Early Return
4. Enter return date and condition
5. Process return
6. Receive asset back

### Payment Issues

If payments are failing:

1. Review payment history
2. Contact customer about failed payment
3. Update payment method
4. Manually mark payment as paid once resolved

See [Payment Management](/operations/payments) for details.

## Best Practices

### Contract Management

* Monitor upcoming contract end dates
* Contact customers 30 days before end
* Offer extension or upgrade options
* Process returns promptly

### Asset Tracking

* Verify serial numbers before assignment
* Update asset condition after returns
* Track asset location
* Document any damage or issues

### Communication

* Send reminders before payments are due
* Notify customers of contract milestones
* Confirm receipt of returns
* Provide clear buyout pricing

### Financial Management

* Track cost recovery for each asset
* Review early return fees
* Set buyout prices strategically
* Monitor payment failure rates

### Data Quality

* Keep customer information up to date
* Document all subscription changes
* Record reasons for cancellations
* Maintain complete payment records
