> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Subscription Lifecycle

> From order placement to contract completion

A subscription moves through stages from initial order to final resolution. During the active period, various events can occur — device replacements, extensions, upgrades — before the contract eventually ends.

## Lifecycle Overview

<Steps>
  <Step title="Order Placed" icon="cart-shopping">
    Customer selects product, variant, and contract length. Order created with status "Pending".
  </Step>

  <Step title="Subscription Activated" icon="box-open">
    Asset assigned by serial number. Subscription becomes "Active" and billing schedule starts.
  </Step>

  <Step title="Active Period" icon="rotate">
    Subscription runs with monthly payments. During this time: devices can be **replaced** if damaged, contracts can be **extended**, or customers can **upgrade** to newer models.
  </Step>

  <Step title="Contract Resolution" icon="flag-checkered">
    Contract reaches its end. Customer chooses: extend, upgrade, buyout, return, or complete.
  </Step>
</Steps>

## Order Status Flow

Orders progress through these statuses before becoming subscriptions:

| Status        | Meaning                                | Next Step                                |
| ------------- | -------------------------------------- | ---------------------------------------- |
| **Pending**   | Order created, awaiting confirmation   | Verify payment method or collect deposit |
| **Confirmed** | Payment method verified, ready to ship | Assign asset and activate subscription   |
| **Cancelled** | Order cancelled before activation      | No subscription created                  |

## Active Subscription

When an asset is assigned, the subscription activates. But "active" doesn't mean static — many things can happen during a subscription.

### At Activation

* Subscription status changes to "Active"
* Start date set (today or future)
* Recurring payment schedule generated
* Asset assigned to customer
* Cost recovery tracking begins at 0%

### During the Subscription

Subscriptions aren't just "wait until the end." Here's what can happen at any point:

| Event            | When It Happens                                          | Result                                                    |
| ---------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| **Replace**      | Device damaged, malfunctioning, or needs swap            | Same subscription continues with different serial number  |
| **Extend**       | Customer wants to keep device longer (even mid-contract) | Contract end date moves forward, same device              |
| **Upgrade**      | Customer wants newer/better model                        | Current subscription ends, new one starts with new device |
| **Early Return** | Customer no longer needs the device                      | Subscription ends early, fee may apply                    |
| **Buyout**       | Customer wants to purchase the device                    | Customer pays buyout price, owns the asset                |

<Info>
  Replace and Extend keep the same subscription. Upgrade creates a new subscription. This distinction matters for reporting and cost recovery tracking.
</Info>

### Monthly Billing

1. Payment generated on billing date
2. Payment status starts as "Pending"
3. You collect payment through your payment processor
4. Mark payment as "Paid" via API or dashboard
5. Cost recovery percentage increases
6. Next payment scheduled

### What You Track

* Current contract month (Month 3 of 12)
* Payments made vs remaining
* Cost recovery percentage
* Next payment date
* Days until contract ends
* Asset location and condition

## End of Contract Options

When a contract approaches its final month, the customer decides what happens next. You control which options are available based on your business model.

### 1. Extend

Add months to the existing subscription with the same asset.

**When to Use:**

* Customer wants to keep the same device longer
* No need for newer model
* Easiest option for both parties

**How It Works:**

* Current subscription extended by X months
* Same monthly payment continues
* Same asset stays with customer
* Contract end date moves forward

**Example:**

```
Original: 12-month contract for MacBook, \$89/month
Action: Customer extends by 6 months
Result: Contract now ends 6 months later, continues at \$89/month
```

<Info>
  Extensions keep the same subscription ID and asset. This is different from creating a new subscription.
</Info>

### 2. Upgrade

End the current subscription and start a new one with a different product and new asset.

**When to Use:**

* Customer wants newer model
* Customer wants different product category
* Current asset is returned to you

**How It Works:**

* Current subscription ends with status "Upgraded"
* New subscription created with new product
* New asset assigned with new serial number
* New contract length selected
* New monthly payment (can be different amount)

**Example:**

```
Current: iPhone 15 Pro, 10 months into 12-month contract
Action: Customer upgrades to iPhone 16 Pro
Result: iPhone 15 returned, new 12-month contract for iPhone 16 starts
```

<Warning>
  Upgrades create entirely new subscriptions. The original subscription ends and cannot be extended further. The original asset must be returned.
</Warning>

### 3. Replace Asset

Swap the physical asset but keep the same subscription active.

**When to Use:**

* Asset is damaged or malfunctioning
* Customer wants same model in different condition
* Same product, just different unit

**How It Works:**

* Subscription remains active
* Original asset returned
* New asset assigned with different serial number
* Same contract continues
* Same monthly payment

**Example:**

```
Current: MacBook serial ABC123, 6 months into contract
Action: Replace with MacBook serial XYZ789
Result: Same subscription continues with new serial number
```

<Info>
  Replacements maintain subscription continuity. All payment history and cost recovery tracking stays with the same subscription record.
</Info>

### 4. Buyout

Customer purchases the asset and ends the subscription.

**When to Use:**

* Customer wants to own the asset
* Asset value is reasonable for purchase
* Clean exit from subscription

**How It Works:**

* Calculate buyout price based on remaining contract value or asset depreciation
* Customer pays buyout amount
* Subscription ends with status "Bought Out"
* Asset ownership transfers to customer
* No further monthly payments

**Buyout Price Calculation:**

You set the buyout pricing logic. Common approaches:

| Method                 | Formula                            | Example                      |
| ---------------------- | ---------------------------------- | ---------------------------- |
| **Remaining Contract** | Sum of remaining monthly payments  | 4 months left × \$89 = \$356 |
| **Depreciated Value**  | Asset value minus collected income | \$1,000 - \$534 = \$466      |
| **Fixed Percentage**   | Original price × percentage        | \$1,000 × 40% = \$400        |

**Example:**

```
Month 6 of 12-month contract, MacBook at \$89/month
Buyout price: \$400
Customer pays \$400, owns the MacBook, subscription ends
```

### 5. Early Return

Customer ends subscription before contract completion and returns the asset.

**When to Use:**

* Customer no longer needs the asset
* Contract breaking allowed by your terms
* Customer pays early return fee

**How It Works:**

* Calculate early return fee based on remaining contract
* Customer pays the fee
* Asset is returned
* Subscription ends with status "Early Return"
* No further monthly payments

**Early Return Fee Calculation:**

Common approaches to discourage early returns:

| Method                      | Formula                       | Example                 |
| --------------------------- | ----------------------------- | ----------------------- |
| **Remaining Payments**      | Sum of all remaining payments | 6 months × \$89 = \$534 |
| **Percentage of Remaining** | Remaining value × percentage  | \$534 × 50% = \$267     |
| **Fixed Fee**               | Flat early termination amount | \$200 flat fee          |

**Example:**

```
Month 6 of 12-month contract, MacBook at \$89/month
Early return fee: \$267 (50% of remaining 6 months)
Customer pays \$267, returns MacBook, subscription ends
```

<Warning>
  Early returns interrupt your expected income stream. Setting appropriate fees helps cover the cost of re-renting or selling the returned asset.
</Warning>

### 6. Complete

Contract ends naturally when all payments are made and customer returns the asset.

**When to Use:**

* Contract reached its full term
* Customer doesn't want to extend, upgrade, or buy out
* Standard contract completion

**How It Works:**

* Final payment is processed
* Customer returns asset
* Subscription ends with status "Completed"
* Asset becomes available for next subscription

**Example:**

```
12-month contract completed, all 12 payments made
Customer returns MacBook in Good condition
Subscription ends, asset returned to Available inventory
```

## Subscription Status Reference

| Status           | Meaning                                        | Can Transition To                                       |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------- |
| **Active**       | Subscription running, payments being generated | Bought Out, Early Return, Completed, Extended, Upgraded |
| **Extended**     | Contract length increased, still active        | Bought Out, Early Return, Completed, Upgraded           |
| **Upgraded**     | Ended because customer upgraded to new product | None (final status)                                     |
| **Bought Out**   | Customer purchased the asset                   | None (final status)                                     |
| **Early Return** | Ended before contract completion               | None (final status)                                     |
| **Completed**    | Contract ended naturally at full term          | None (final status)                                     |
| **Cancelled**    | Administratively terminated                    | None (final status)                                     |

## Timeline Example

Here's how a typical 12-month subscription might progress:

**Month 1-3: Early Contract**

* Subscription activated Jan 1, 2025
* Monthly payments of \$89 collected
* Cost recovery: 26.7% after 3 payments (\$267 collected)

**Month 4-6: Mid Contract**

* Payments continue
* Cost recovery: 53.4% after 6 payments (\$534 collected)
* Asset maintenance if needed (replace)

**Month 7-9: Late Contract**

* Payments continue
* Cost recovery: 80.1% after 9 payments (\$801 collected)
* Start discussing end-of-contract options with customer

**Month 10-12: Contract Ending**

* Final payments processed
* Cost recovery: 106.8% after 12 payments (\$1,068 collected)
* Customer decides: extend, upgrade, buyout, return, or complete

**Post-Contract:**

* If Extended: continues at same rate
* If Upgraded: new subscription starts with new product
* If Bought Out: customer pays \$300, owns asset
* If Returned: asset back to Available status
* If Completed: contract fulfilled, asset returned

## API Integration

All lifecycle actions are available through the API:

```bash theme={null}
# Extend subscription
POST /subscriptions/{id}/extend
{
  "additional_months": 6
}

# Upgrade subscription
POST /subscriptions/{id}/upgrade
{
  "new_product_variant_id": "pv_xyz789",
  "contract_months": 12
}

# Replace asset
POST /subscriptions/{id}/replace
{
  "new_asset_serial": "NEW123XYZ"
}

# Calculate buyout
POST /subscriptions/{id}/calculate-buyout

# Process buyout
POST /subscriptions/{id}/buyout
{
  "buyout_amount": 40000
}

# Calculate early return fee
POST /subscriptions/{id}/calculate-early-return

# Process early return
POST /subscriptions/{id}/early-return
{
  "fee_amount": 26700
}
```

## Next Steps

<CardGroup cols={2}>
  <Card title="Cost Recovery" icon="chart-line" href="/platform/cost-recovery">
    Track profitability per asset over time
  </Card>

  <Card title="API Reference - Subscriptions" icon="code" href="/api-reference/subscriptions/list">
    Complete subscription API documentation
  </Card>
</CardGroup>
