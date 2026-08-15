> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Cost Recovery & Profitability

> Track real profitability per asset with margin analysis, breakeven calculations, and portfolio health

FlexPortal tracks whether each asset is actually profitable. Most subscription platforms show income numbers. FlexPortal shows you the real numbers: which assets have paid for themselves, which ones are at risk, and exactly when profit starts.

## What Is Cost Recovery?

Cost recovery measures what percentage of an asset's acquisition cost has been recovered through actual collected subscription income. It's profitability tracking at the asset level, not portfolio vanity metrics.

**The calculation is simple:**

```
Cost Recovery % = (Total Collected / Acquisition Cost) × 100
Current Profit = Total Collected - Acquisition Cost
```

**Examples Across Industries:**

**Laptop (MacBook Pro 14"):**

* Acquisition cost: \$1,000
* Monthly subscription: \$89
* After 6 months: \$534 collected
* Cost recovery: 53.4%
* Current profit: -\$466 (still recovering)

**Furniture (Ergonomic Office Chair):**

* Acquisition cost: €400
* Monthly subscription: €29
* After 14 months: €406 collected
* Cost recovery: 101.5%
* Current profit: €6 (profitable)

**E-Bike (Urban Commuter):**

* Acquisition cost: €800
* Monthly subscription: €59
* After 18 months: €1,062 collected
* Cost recovery: 132.8%
* Current profit: €262 (highly profitable)

When cost recovery reaches 100%, you've broken even on the asset. Everything beyond 100% is profit.

## Setting Up Profitability Tracking

To track profitability, FlexPortal uses two key price fields at the product/variant level:

### 1. Acquisition Cost

What you actually paid to acquire the asset. This is the baseline for all profitability calculations.

**Acquisition Cost Includes:**

* Purchase price from supplier
* Shipping and import fees
* Initial refurbishment or preparation
* Any other costs to make the asset subscription-ready

**Example:**

```
MacBook Pro 14" purchased for \$950
Shipping: \$30
Initial inspection and cleaning: \$20
Total acquisition cost: \$1,000
```

<Info>
  Acquisition cost is optional but highly recommended. Without it, you can only track income, not actual profitability.
</Info>

### 2. List Price

The retail/MSRP value of the asset. This is used for:

* Buyout calculations (when customers want to purchase the asset)
* Margin analysis (comparing your cost to market value)
* Insurance valuation

**Example:**

```
MacBook Pro 14" retail price: \$1,999
Your acquisition cost: \$1,000
Your margin: 50%
```

Both fields are set when you create a product variant and can be updated at any time.

## Understanding the Metrics

FlexPortal calculates multiple profitability metrics automatically. Here's what each one means and how it's calculated.

### Margin Percentage

Shows how much room you have between what you paid and the market value. Calculated at the product/variant level.

```
Margin % = ((List Price - Acquisition Cost) / List Price) × 100
```

**Example:**

```
List Price: \$1,999
Acquisition Cost: \$1,000
Margin: ((1,999 - 1,000) / 1,999) × 100 = 50%
```

**Visual Indicators:**

* Red: Negative margin (you paid more than market value)
* Orange: Less than 15% margin (low margin)
* Green: 15% or higher margin (healthy margin)

### Breakeven Calculation

Shows which month the asset becomes profitable. Calculated at the product/variant level based on monthly subscription price.

```
Breakeven Months = Acquisition Cost / Monthly Price
```

**Example:**

```
Acquisition Cost: \$1,000
Monthly Price: \$89
Breakeven: 1,000 / 89 = 11.2 months
Display: "Profit: month 13+"
```

**Breakeven Warnings:**

If breakeven exceeds the contract length, FlexPortal shows a warning. This means the asset won't become profitable within the contract period.

```
Contract Length: 12 months
Breakeven: 15 months
Warning: "Asset won't break even within contract"
```

This tells you to either increase the monthly price or extend the contract length.

### Cost Recovery Percentage

Tracks actual profitability at the subscription level based on real collected payments, not projections.

```
Cost Recovery % = (Total Collected / Acquisition Cost) × 100
```

**Month-by-Month Example:**

| Month | Payment | Collected | Acquisition Cost | Recovery % | Status     |
| ----- | ------- | --------- | ---------------- | ---------- | ---------- |
| 0     | -       | \$0       | \$1,000          | 0%         | Recovering |
| 1     | \$89    | \$89      | \$1,000          | 8.9%       | Recovering |
| 3     | \$89    | \$267     | \$1,000          | 26.7%      | Recovering |
| 6     | \$89    | \$534     | \$1,000          | 53.4%      | Recovering |
| 9     | \$89    | \$801     | \$1,000          | 80.1%      | Recovering |
| 11    | \$89    | \$979     | \$1,000          | 97.9%      | Recovering |
| 12    | \$89    | \$1,068   | \$1,000          | **106.8%** | Profitable |
| 18    | \$89    | \$1,602   | \$1,000          | **160.2%** | Profitable |

**Key Milestones:**

* Month 11: Nearly broken even (97.9%)
* Month 12: Profitable (106.8%, +\$68 profit)
* Month 18: Highly profitable (160.2%, +\$602 profit)

**Progress Bar Visualization:**

FlexPortal shows cost recovery as a progress bar that fills as payments are collected:

* 0-50%: Red bar
* 50-100%: Yellow bar
* 100%+: Green bar

### Current Profit

The actual dollar amount of profit (or loss) on the asset.

```
Current Profit = Total Collected - Acquisition Cost
```

**Examples:**

```
53.4% recovery: \$534 - \$1,000 = -\$466 (loss)
100% recovery: \$1,000 - \$1,000 = \$0 (breakeven)
160.2% recovery: \$1,602 - \$1,000 = +\$602 (profit)
```

## Recovery Status Categories

Each subscription is assigned a recovery status based on cost recovery percentage and contract progress. This gives you an at-a-glance view of portfolio health.

| Status         | Condition                                  | Color  | Meaning                                                |
| -------------- | ------------------------------------------ | ------ | ------------------------------------------------------ |
| **Profitable** | Recovery > 100%                            | Green  | Asset has paid for itself and is generating profit     |
| **Recovering** | 50% \< Recovery ≤ 100%                     | Yellow | On track to break even, more than halfway there        |
| **At Risk**    | Recovery ≤ 50% AND contract > 50% complete | Red    | Won't break even at current pace, needs intervention   |
| **No Data**    | Acquisition cost not provided              | Gray   | Can't calculate profitability without acquisition cost |

**Status Logic Examples:**

```
Scenario 1:
- Recovery: 65%
- Contract progress: 40%
- Status: Recovering (yellow)
- Reason: Above 50% recovery and on track

Scenario 2:
- Recovery: 45%
- Contract progress: 70%
- Status: At Risk (red)
- Reason: Below 50% recovery and contract is more than half complete

Scenario 3:
- Recovery: 125%
- Contract progress: 100%
- Status: Profitable (green)
- Reason: Asset has exceeded acquisition cost
```

**When to Take Action:**

* **At Risk (Red)**: Review pricing, consider contract extension, or implement early return fees
* **Recovering (Yellow)**: Monitor progress, likely to break even by contract end
* **Profitable (Green)**: Optimize for more assets like this
* **No Data (Gray)**: Add acquisition cost to enable profitability tracking

## Portfolio Health Dashboard

The portfolio health view aggregates all subscription statuses into a single dashboard showing distribution across recovery categories.

### Donut Chart Visualization

Shows the breakdown of your portfolio:

* Green slice: Profitable subscriptions (over 100% recovery)
* Yellow slice: Recovering subscriptions (50-100% recovery)
* Red slice: At-risk subscriptions (under 50% recovery, over 50% contract complete)
* Gray slice: No data (acquisition cost missing)

### Aggregate Statistics

**Portfolio-Level Metrics:**

* Total subscriptions: 500
* Profitable: 275 (55%)
* Recovering: 180 (36%)
* At Risk: 30 (6%)
* No Data: 15 (3%)

**Financial Metrics:**

* Average cost recovery: 118%
* Total unrecovered cost: \$45,000
* Total profit generated: \$320,000
* Portfolio health score: 91/100

### At-a-Glance Profitability View

The dashboard answers key questions instantly:

* How many assets are profitable?
* How many are at risk of not breaking even?
* What's the average recovery rate across the portfolio?
* Which product categories are performing best?

## Multi-Lifecycle Tracking

Assets often go through multiple subscription cycles. FlexPortal tracks lifetime cost recovery across all subscriptions for the same asset.

### Asset Lifecycle Journey

**First Subscription:**

* 12 months at \$89/month
* Collected: \$1,068
* Recovery: 106.8%
* Status: Profitable

**Asset Returned, Inspected, Then Second Subscription:**

* 12 months at \$79/month (slightly lower, asset aging)
* Additional collected: \$948
* Total lifetime collected: \$2,016
* Total lifetime recovery: 201.6%
* Lifetime profit: \$1,016

**Third Subscription:**

* 6 months at \$69/month
* Additional collected: \$414
* Total lifetime collected: \$2,430
* Total lifetime recovery: 243%
* Lifetime profit: \$1,430

<Info>
  Cost recovery continues climbing across all subscriptions until the asset is retired, sold, or lost. This shows true lifetime value per asset.
</Info>

## Why This Matters

Most subscription platforms show income metrics. FlexPortal shows profitability metrics. There's a critical difference.

### Income Alone Doesn't Tell the Story

| Metric             | What It Shows                         | What It Misses                        |
| ------------------ | ------------------------------------- | ------------------------------------- |
| **Monthly Income** | \$10,000/month from 100 subscriptions | Which assets are profitable           |
| **Annual Income**  | \$120,000/year recurring              | When assets break even                |
| **Total Income**   | \$500,000 lifetime collected          | Whether you're actually profitable    |
| **Growth Rate**    | 25% income growth month-over-month    | Whether new assets will be profitable |

### Cost Recovery Shows True Performance

| Metric                     | What It Reveals                                                      |
| -------------------------- | -------------------------------------------------------------------- |
| **Per-Asset Recovery**     | Asset A at 125% = profitable, Asset B at 45% = still recovering cost |
| **Breakeven Timeline**     | This laptop breaks even in 12 months, this e-bike in 14 months       |
| **Product Profitability**  | Laptops reach 100% recovery faster than furniture                    |
| **Contract Length Impact** | 18-month contracts more profitable than 12-month                     |
| **Portfolio Health**       | 55% of assets are profitable, 6% are at risk                         |

**The Key Difference:**

A business can show \$50,000 monthly income while losing money on half their assets. FlexPortal surfaces this reality so you can fix it before it becomes a bigger problem.

## Example: Multi-Category Portfolio

TechFlex operates a subscription business across multiple product categories with FlexPortal.

**Portfolio After 18 Months:**

| Product                  | Assets | Acquisition Cost | Monthly Price | Avg Recovery | Status     |
| ------------------------ | ------ | ---------------- | ------------- | ------------ | ---------- |
| Laptop (MacBook Pro)     | 75     | \$1,000          | \$89          | 118%         | Profitable |
| Furniture (Office Chair) | 200    | €400             | €29           | 95%          | Recovering |
| E-Bike (Urban Commuter)  | 60     | €800             | €59           | 132%         | Profitable |

**Portfolio Health:**

* Total assets: 335
* Profitable: 135 (40%)
* Recovering: 180 (54%)
* At Risk: 15 (4%)
* No Data: 5 (2%)
* Average recovery: 115%

**Key Insights:**

1. **Laptops** break even in 11.2 months, highly profitable on 12+ month contracts
2. **E-bikes** have highest recovery (132%) due to longer average contract length (18 months)
3. **Office chairs** need adjustment - at 95% recovery after 18 months, most won't break even on 12-month contracts
4. Total portfolio is profitable (115% average), but office chair category is dragging down performance

**Action Taken:**

Based on cost recovery data:

* Increased office chair monthly price from €29 to €33 (+14%)
* Offered 18-month contracts for furniture instead of 12-month
* Added early return fees for furniture (20% of remaining contract value)
* Result: New furniture subscriptions projected to reach 110% recovery

**6 Months Later:**

| Product   | Assets | Avg Recovery | Change                    |
| --------- | ------ | ------------ | ------------------------- |
| Laptop    | 95     | 122%         | +4%                       |
| Furniture | 240    | 103%         | +8% (pricing fix working) |
| E-Bike    | 80     | 135%         | +3%                       |

Office chairs moved from 95% to 103% average recovery. The pricing and contract length adjustments turned a losing category into a profitable one.

## Impact on Business Decisions

Cost recovery data helps you optimize your subscription business across multiple dimensions.

### 1. Pricing Strategy

Compare recovery rates across different pricing tiers to find the optimal monthly price:

| Product | Monthly Price | Contract  | Recovery at End | Breakeven   |
| ------- | ------------- | --------- | --------------- | ----------- |
| MacBook | \$75          | 12 months | 90% (too low)   | 13.3 months |
| MacBook | \$89          | 12 months | 106.8% (good)   | 11.2 months |
| MacBook | \$95          | 12 months | 114% (better)   | 10.5 months |

Lower pricing might increase demand but delay breakeven. Higher pricing accelerates profitability but may reduce conversions. Cost recovery data shows the actual financial impact.

### 2. Contract Length Optimization

See how contract length affects profitability for the same asset:

| Contract Length | Monthly Price | Total Collected | Recovery %               | Profit |
| --------------- | ------------- | --------------- | ------------------------ | ------ |
| 6 months        | \$120         | \$720           | 72% (not profitable)     | -\$280 |
| 12 months       | \$89          | \$1,068         | 106.8% (profitable)      | +\$68  |
| 18 months       | \$70          | \$1,260         | 126% (most profitable)   | +\$260 |
| 24 months       | \$55          | \$1,320         | 132% (highly profitable) | +\$320 |

Longer contracts with lower monthly payments often generate more total income and higher recovery rates. The data shows exactly which contract lengths maximize profitability.

### 3. Product Mix Analysis

Compare recovery rates across product categories to understand which products reach profitability faster:

| Category          | Avg Acquisition | Avg Monthly | Breakeven Months | 18-Month Recovery |
| ----------------- | --------------- | ----------- | ---------------- | ----------------- |
| Phones            | \$600           | \$45        | 13.3 months      | 135%              |
| Laptops           | \$1,000         | \$89        | 11.2 months      | 160%              |
| E-Bikes           | €800            | €59         | 13.6 months      | 132%              |
| Office Furniture  | €400            | €29         | 13.8 months      | 131%              |
| Premium Strollers | €500            | €39         | 12.8 months      | 150%              |

**Insights:**

* Laptops have fastest breakeven and highest 18-month recovery
* Phones break even slower but still highly profitable
* Furniture and strollers need 18+ month contracts for strong profitability

This reveals which products to prioritize and which need pricing or contract adjustments.

### 4. Early Return Impact

When customers return early, you see exactly how much cost you haven't recovered. This helps you set appropriate early return fees.

**Example:**

```
Asset cost: \$1,000
Contract: 12 months at \$89/month
Early return at month 6:
- Collected: \$534 (53.4% recovery)
- Unrecovered: \$466

Early return fee options:
- 20% of remaining contract: \$107 (total recovery: 64.1%, still losing \$359)
- 50% of remaining contract: \$267 (total recovery: 80.1%, losing \$199)
- Full remaining contract: \$534 (total recovery: 106.8%, profitable)
```

Cost recovery shows the real financial impact of early returns and helps you set fees that protect profitability.

### 5. Extension and Renewal Pricing

When customers want to extend or renew, you know exactly where profitability stands:

**Scenario 1: Already Profitable**

```
After 12 months:
- Recovery: 106.8%
- Profit: \$68

Extension pricing:
- Original monthly: \$89
- Extension offer: \$75 (lower to incentivize, still 100% profit)
- 6-month extension adds \$450 pure profit
```

**Scenario 2: Not Yet Profitable**

```
After 12 months:
- Recovery: 95%
- Unrecovered: \$50

Extension pricing:
- Original monthly: \$89
- Extension offer: \$89 (maintain to reach breakeven)
- Need 1+ more month to break even
```

## Dashboard Visualization

The FlexPortal dashboard shows cost recovery across multiple views:

### Asset Detail View

For each asset, see:

* Current cost recovery percentage with progress bar
* Total collected vs acquisition cost
* Current profit/loss amount
* Breakeven date (when recovery hit 100%)
* Lifetime value across all subscriptions
* Recovery status (Profitable, Recovering, At Risk, No Data)

### Portfolio Health View

Across all assets, see:

* Donut chart showing distribution by recovery status
* Total subscriptions by category
* Average cost recovery percentage
* Number of assets above 100% (profitable)
* Number of assets below 50% (at risk)
* Total unrecovered cost across portfolio
* Total profit generated

### Product Performance

Compare products by:

* Average breakeven time
* Average lifetime recovery percentage
* Margin percentage
* Most profitable products
* Products needing pricing adjustment
* Recovery status distribution by product

## API Access

Cost recovery data is available through the API:

```bash theme={null}
# Get asset with cost recovery
GET /assets/{id}

Response:
{
  "id": "ast_123",
  "serial_number": "C02X1234ABCD",
  "acquisition_cost": 100000,
  "list_price": 199900,
  "margin_percentage": 50,
  "lifetime_collected": 106800,
  "cost_recovery_percentage": 106.8,
  "current_subscription": {
    "id": "sub_456",
    "monthly_amount": 8900,
    "collected_this_cycle": 106800,
    "recovery_status": "profitable"
  }
}
```

```bash theme={null}
# List assets by recovery percentage
GET /assets?filter[cost_recovery][gte]=100

Returns all assets that have broken even or are profitable
```

```bash theme={null}
# Get portfolio health statistics
GET /analytics/portfolio-health

Response:
{
  "total_subscriptions": 500,
  "profitable": 275,
  "recovering": 180,
  "at_risk": 30,
  "no_data": 15,
  "average_recovery_percentage": 118,
  "total_profit": 32000000,
  "total_unrecovered": 4500000
}
```

## Key Concepts

### Cost Recovery vs Profit Margin

* **Cost Recovery**: What percentage of acquisition cost has been collected through subscription income
* **Profit Margin**: Difference between list price and acquisition cost as a percentage

Cost recovery focuses on subscription profitability over time. Profit margin shows the potential value gap between what you paid and market value.

### Lifetime Value Per Asset

Traditional subscription businesses measure Customer Lifetime Value (CLV). For physical product subscriptions, Asset Lifetime Value (ALV) is equally important:

**Asset Lifetime Value = Total Collected - Acquisition Cost**

An asset with 200% cost recovery has generated ALV equal to its original acquisition cost. A \$1,000 laptop at 200% recovery has generated \$1,000 in profit beyond the initial investment.

### Breakeven Point

The moment when cost recovery reaches 100%. Beyond this point, every payment contributes to profit.

For a \$1,000 asset at \$89/month:

* Breakeven occurs during Month 12
* After \$1,000 collected (11.2 months mathematically)
* Display: "Profit: month 13+"

### Recovery Status vs Collection Status

* **Recovery Status**: Whether the asset is profitable (Profitable, Recovering, At Risk, No Data)
* **Collection Status**: Whether payments are current (Current, Late, Defaulted)

An asset can be "Profitable" in recovery but "Late" in collection. These are independent metrics tracking different aspects of subscription health.

## Next Steps

<CardGroup cols={2}>
  <Card title="Subscription Lifecycle" icon="rotate" href="/platform/subscription-lifecycle">
    Understand how extensions and upgrades affect cost recovery
  </Card>

  <Card title="Assets API" icon="code" href="/api-reference/assets/list">
    Access cost recovery data programmatically
  </Card>
</CardGroup>
