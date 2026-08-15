> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Assets

> Track and manage physical inventory

Assets are the physical units you subscribe to customers. Each asset has a unique serial number and is tracked throughout its lifecycle: available inventory, rented out, returned, sold, or retired.

## What is an Asset?

An asset is a specific physical unit available for subscription. Unlike products (catalog items), assets represent individual units with:

* Unique serial number
* Physical condition and status
* Location tracking
* Subscription history
* Cost recovery tracking

### Product vs Asset

| Product                          | Asset                                   |
| -------------------------------- | --------------------------------------- |
| Catalog item                     | Physical unit                           |
| "iPhone 16 Pro 256GB"            | Serial: DX8K2M3NQP                      |
| "Urban E-Bike 250W"              | Frame: EB2024-5678                      |
| "Ergonomic Office Chair"         | Serial: EOC-PRO-2024-0123               |
| Can have unlimited subscriptions | Can only be with one customer at a time |
| Has variants and pricing         | Has condition and status                |

<Info>
  A product is the model. An asset is a specific unit of that model. FlexPortal tracks assets across any product type — electronics with serial numbers, bikes with frame numbers, furniture with asset tags.
</Info>

<Info>
  For phone products (smartphones, mobile devices), FlexPortal validates IMEI numbers (15 digits). Other product categories accept any serial number format.
</Info>

## Asset Statuses

Assets flow through different statuses based on their lifecycle:

| Status          | Description                                          |
| --------------- | ---------------------------------------------------- |
| **Available**   | Ready to be assigned to a subscription               |
| **Rented Out**  | Currently assigned to an active subscription         |
| **Returned**    | Customer returned it, needs inspection/refurbishment |
| **Sold**        | Sold to customer via buyout, no longer in inventory  |
| **Unavailable** | Cannot be used (damaged, lost, in repair, retired)   |

### Status Details

#### Available

Asset is in inventory and ready for new subscriptions:

* Inspected and refurbished if needed
* Quality checked
* Packaged and ready to ship

#### Rented Out

Asset is with a customer on an active subscription:

* Currently generating income
* Cannot be assigned to another subscription
* Location is customer's address

#### Returned

Customer returned the asset:

* Needs inspection to assess condition
* May need refurbishment or repair
* Not yet ready for new subscriptions

Once inspected and prepared, change status to Available.

#### Sold

Asset was sold to customer via buyout:

* No longer in your inventory
* Customer owns the asset
* Cannot be used for future subscriptions

#### Unavailable

Asset cannot be used for subscriptions due to:

* **In Repair** - Undergoing repairs
* **Lost** - Missing asset
* **Stolen** - Asset was stolen
* **Damaged Beyond Repair** - Cannot be restored
* **Retired** - Removed from service

<Tip>
  Use specific unavailable reasons. Instead of just "Unavailable", note whether it's in repair, lost, or retired.
</Tip>

## Creating Assets

Add assets to your inventory when you acquire new units. FlexPortal supports any physical product with unique identifiers:

1. Navigate to **Assets** in the left sidebar
2. Click **New Asset** in the top right
3. Enter asset details:
   * **Serial number** - Unique identifier (manufacturer serial for electronics, frame number for bikes, asset tag for furniture)
   * **Product** - Select the product model
   * **Variant** - Choose specific variant
   * **Acquisition cost** - What you paid for the asset
   * **Acquisition date** - When you purchased it
   * **Condition** - Current condition (Excellent, Good, Fair, Poor)
   * **Status** - Set to Available if ready for subscriptions
4. Click **Save**

**Examples:**

* **MacBook Pro:** Serial C02X1234ABCD
* **Urban E-Bike:** Frame number EB2024-5678
* **Office Chair:** Asset tag EOC-PRO-2024-0123

<Warning>
  Serial numbers must be unique. The system will prevent duplicate serial numbers.
</Warning>

## Assigning Assets to Subscriptions

Assets are assigned when creating a subscription from an order item:

1. Open an order
2. Find the item to fulfill
3. Click **Create Subscription**
4. Enter the **serial number** of the asset to assign
5. Click **Create**

The asset status automatically changes to "Rented Out" and is linked to the subscription.

<Info>
  Only assets with status "Available" can be assigned to new subscriptions.
</Info>

## Asset Condition Ratings

Track the physical condition of each asset:

| Condition     | Description                          |
| ------------- | ------------------------------------ |
| **Excellent** | Like new, no visible wear            |
| **Good**      | Light wear, fully functional         |
| **Fair**      | Moderate wear, fully functional      |
| **Poor**      | Heavy wear, may have cosmetic damage |
| **Damaged**   | Requires repair before use           |

### When to Update Condition

Update asset condition when:

* Customer returns the asset
* Asset is inspected after return
* Asset is repaired or refurbished
* Damage is reported

1. Open the asset
2. Click **Edit**
3. Change **Condition**
4. Add notes about any damage or issues
5. Click **Save**

## Tracking Asset Location

Know where each asset is at all times:

### Location States

* **Warehouse** - In your inventory
* **In Transit** - Being shipped to customer
* **With Customer** - At customer's location
* **Returned to Warehouse** - Back from customer
* **At Repair Center** - Being repaired

### Viewing Asset Location

1. Open the asset detail page
2. The **Location** field shows current location

For rented out assets, location defaults to the customer's address from their subscription.

## Asset History

Every asset has a complete history tracking:

* When it was acquired
* All subscriptions it's been assigned to
* Returns and return conditions
* Repairs and refurbishments
* Status changes
* Location changes

View asset history:

1. Open the asset
2. Scroll to **History** section

This provides a complete audit trail for the asset's lifecycle.

## Cost Recovery by Asset

Track how much income each asset has generated:

```
Cost Recovery = (Total Income Collected / Acquisition Cost) × 100%
```

Example:

* Acquisition cost: \$1,200
* Been on 2 subscriptions
* Total income collected: \$1,780
* Cost recovery: 148%

<Info>
  Cost recovery over 100% means the asset is profitable. Under 100% means you haven't recovered the purchase cost yet.
</Info>

### Viewing Asset Cost Recovery

The asset detail page shows:

* Acquisition cost
* Total income collected across all subscriptions
* Cost recovery percentage
* List of subscriptions that used this asset

## Handling Returns

When a customer returns an asset:

1. Process the return in the subscription (see [Subscriptions](/operations/subscriptions#early-return))
2. Asset status automatically changes to "Returned"
3. Receive the physical asset
4. Inspect the asset for damage and functionality, then update condition rating
5. Refurbish or repair if needed
6. Update asset status to "Available" when ready for the next subscription

<Tip>
  Always inspect returned assets before making them available again. Update the condition rating to reflect actual state.
</Tip>

## Handling Buyouts

When a customer buys out an asset:

1. Process the buyout in the subscription
2. Asset status automatically changes to "Sold"
3. Asset is removed from available inventory
4. Final cost recovery is calculated

Sold assets remain in the system for record keeping but cannot be assigned to new subscriptions.

## Managing Unavailable Assets

When assets cannot be used:

### Moving to Unavailable

1. Open the asset
2. Click **Edit**
3. Change **Status** to **Unavailable**
4. In notes, specify reason:
   * "In repair - screen replacement"
   * "Lost during shipment"
   * "Damaged beyond repair"
   * "Retired from service"
5. Click **Save**

### Returning to Service

When asset is repaired and ready:

1. Open the asset
2. Click **Edit**
3. Update **Condition** to reflect current state
4. Change **Status** to **Available**
5. Click **Save**

## Asset Search and Filtering

Find assets quickly:

### Search by:

* Serial number
* Product name
* Customer name (for rented assets)

### Filter by:

* **Status** - Available, Rented Out, Returned, Sold, Unavailable
* **Product** - Specific product models
* **Condition** - Excellent, Good, Fair, Poor, Damaged
* **Cost recovery** - Under/over 100%

## Bulk Asset Management

For managing multiple assets:

### Importing Assets

Upload CSV with asset details:

1. Click **Import Assets**
2. Download CSV template
3. Fill in:
   * Serial numbers
   * Product SKUs
   * Acquisition costs
   * Acquisition dates
4. Upload completed CSV
5. Review and confirm import

### Exporting Assets

Export asset list for analysis:

1. Apply filters to select assets
2. Click **Export**
3. Choose format (CSV or Excel)
4. Download file

## Asset Valuation

Track asset value over time:

### Acquisition Cost

What you paid for the asset when purchased. This never changes.

### Current Value

Estimated current worth based on:

* Age
* Condition
* Market value
* Depreciation

Update current value periodically to reflect market conditions.

### Buyout Price

What you charge customers to purchase the asset. Consider:

* Current value
* Cost recovery so far
* Market demand
* Remaining contract term

## Asset Lifecycle Examples

Here are example lifecycles across different industries:

### Example 1: MacBook Pro (Electronics)

**1. Acquisition**

* Purchase MacBook Pro 14"
* Serial: C02X1234ABCD
* Cost: \$1,000
* Status: Available

**2. First Subscription**

* Assigned to customer Jane Smith
* 12-month contract at \$89/month
* Status: Rented Out

**3. Return & Second Life**

* Customer returns, condition: Good
* Minor refurbishment: \$50
* Assigned to Bob Chen at \$79/month
* Total income collected after 20 months: \$1,779
* Cost recovery: 177%

### Example 2: Urban E-Bike (Mobility)

**1. Acquisition**

* Purchase Urban E-Bike
* Frame: EB2024-5678
* Cost: €800
* Status: Available

**2. First Subscription**

* Assigned to customer Maria Lopez
* 24-month contract at €59/month
* Status: Rented Out

**3. Maintenance & Return**

* Minor service at month 12: €50
* Customer completes 24 months
* Total income collected: €1,416
* Cost recovery: 177%

### Example 3: Office Chair (Furniture)

**1. Acquisition**

* Purchase Ergonomic Office Chair
* Asset tag: EOC-PRO-2024-0123
* Cost: €400
* Status: Available

**2. First Subscription**

* Assigned to TechCorp BV
* 12-month contract at €29/month
* Status: Rented Out

**3. Customer Buyout**

* After 12 months, customer buys chair for €150
* Total income: €348 + €150 = €498
* Cost recovery: 124%
* Status: Sold

## Best Practices

### Serial Number Management

* Record serial numbers immediately upon receipt
* Verify serial numbers before assignment
* Use photos to document serial numbers
* Keep serial numbers consistent with manufacturer format

### Condition Tracking

* Inspect all returned assets thoroughly
* Document any damage with photos
* Update condition ratings promptly
* Set minimum condition standards for new subscriptions

### Inventory Management

* Know how many assets are available vs rented
* Track unavailable assets and reason
* Plan for replacement assets
* Monitor asset age and depreciation

### Financial Tracking

* Monitor cost recovery for each asset
* Calculate total portfolio cost recovery
* Set buyout prices strategically
* Track repair and refurbishment costs

### Quality Control

* Inspect assets before sending to customers
* Set condition standards for each grade
* Test functionality thoroughly
* Keep assets clean and presentable

## Common Scenarios

### New Asset Arrives

1. Unpack and inspect
2. Record serial number
3. Test functionality
4. Create asset in system
5. Set status to Available

### Asset Returned Damaged

1. Receive asset from customer
2. Inspect and document damage
3. Update condition to "Damaged"
4. Set status to "Unavailable" with reason "In repair"
5. Get repair quote
6. After repair, update condition and set to Available

### Cannot Find Asset

1. Search for asset by serial number
2. Check last known location
3. Contact last customer if recent return
4. If truly lost, update status to "Unavailable" with reason "Lost"
5. Document circumstances

### Retiring Old Assets

1. Identify assets that are:
   * Too old for subscriptions
   * Cost more to maintain than value
   * Outdated technology
2. Update status to "Unavailable" with reason "Retired"
3. Consider selling as-is or recycling
4. Keep in system for historical records
