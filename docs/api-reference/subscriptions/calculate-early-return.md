> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Calculate Early Return Fee

> Calculates the early return fee for a subscription without performing the return.

## Overview

Calculate the early return fee for a subscription before processing the actual early return. This endpoint returns a recommended fee based on remaining contract value and your configured policies—use it to present options to customers.

<Info>
  This is a **read-only calculation**—it doesn't modify the subscription. Call [Early Return](/api-reference/subscriptions/early-return) to actually process the return.
</Info>

## Request Fields

| Field            | Required | Description                       |
| ---------------- | -------- | --------------------------------- |
| `subscriptionId` | Yes      | The subscription to calculate for |

## Example Request

```json theme={null}
{
  "subscriptionId": "sub_abc123"
}
```

## Response Structure

```json theme={null}
{
  "success": true,
  "subscriptionId": "sub_abc123",
  "calculation": {
    "earlyReturnFee": 258.00,
    "breakdown": {
      "remainingContractValue": 516.00,
      "feePercentage": 50,
      "monthsRemaining": 4,
      "monthlyAmount": 129.00
    },
    "costRecovery": {
      "acquisitionCost": 1800.00,
      "totalCollected": 1548.00,
      "projectedWithFee": 1806.00,
      "costRecoveryPercent": 100.3
    }
  }
}
```

## Understanding the Calculation

### Remaining Contract Value

Total value of remaining payments:

```
remainingContractValue = monthsRemaining × monthlyAmount
```

### Fee Percentage

The percentage of remaining value charged as fee (configured in tenant settings):

```
earlyReturnFee = remainingContractValue × (feePercentage / 100)
```

### Cost Recovery Impact

The calculation shows whether you'll recover costs even with early return:

* `projectedWithFee`: Total collected + early return fee
* `costRecoveryPercent`: Whether acquisition cost is covered

## Common Use Cases

### 1. Quoting Customers

```javascript theme={null}
async function getEarlyReturnQuote(subscriptionId) {
  const calc = await calculateEarlyReturnFee({ subscriptionId });

  return {
    fee: calc.calculation.earlyReturnFee,
    monthsLeft: calc.calculation.breakdown.monthsRemaining,
    regularPayments: calc.calculation.breakdown.remainingContractValue,
    savings: calc.calculation.breakdown.remainingContractValue - calc.calculation.earlyReturnFee,
    message: `Early return fee: €${calc.calculation.earlyReturnFee} (saves €${savings} vs completing contract)`
  };
}
```

### 2. Comparing Options for Customer

```javascript theme={null}
async function getEndingOptions(subscriptionId) {
  const [earlyReturn, buyout] = await Promise.all([
    calculateEarlyReturnFee({ subscriptionId }),
    calculateBuyout({ subscriptionId })
  ]);

  return {
    options: [
      {
        action: 'Complete contract',
        cost: earlyReturn.calculation.breakdown.remainingContractValue,
        outcome: 'Return device at contract end'
      },
      {
        action: 'Early return now',
        cost: earlyReturn.calculation.earlyReturnFee,
        outcome: 'Return device today, pay fee'
      },
      {
        action: 'Buyout',
        cost: buyout.calculation.buyoutPrice,
        outcome: 'Keep device forever'
      }
    ]
  };
}
```

### 3. Evaluating Fee Waiver

```javascript theme={null}
async function shouldWaiveFee(subscriptionId, customerHistory) {
  const calc = await calculateEarlyReturnFee({ subscriptionId });

  // Check if we've already recovered our costs
  const costRecovered = calc.calculation.costRecovery.costRecoveryPercent >= 100;

  // Check customer value
  const isHighValueCustomer = customerHistory.lifetimeRevenue > 5000;

  return {
    fee: calc.calculation.earlyReturnFee,
    recommendWaive: costRecovered && isHighValueCustomer,
    reason: costRecovered
      ? 'Asset costs fully recovered'
      : 'Consider partial waiver for customer retention'
  };
}
```

## Presentation Tips

When showing early return fees to customers:

* **Compare to remaining payments**: Show savings vs completing contract
* **Explain the policy**: Help customers understand the fee rationale
* **Offer alternatives**: Present buyout or extension options
* **Be flexible**: Consider waivers for good customers or hardship cases

## Related Endpoints

* [Early Return](/api-reference/subscriptions/early-return) - Process the actual early return
* [Calculate Buyout](/api-reference/subscriptions/calculate-buyout) - Alternative: buyout calculation
* [Get Subscription](/api-reference/subscriptions/get) - Get subscription details
* [Extend Subscription](/api-reference/subscriptions/extend) - Alternative: extend contract


## OpenAPI

````yaml POST /v1/subscriptions/calculate-early-return-fee
openapi: 3.1.0
info:
  title: FlexPortal API
  version: 1.0.0
  description: >-
    FlexPortal is a subscription management platform for physical products like
    devices, equipment, and hardware. The API enables you to:


    - **Orders**: Create and manage subscription orders for customers

    - **Subscriptions**: Track active subscriptions, extend contracts, process
    buyouts and returns

    - **Products**: Maintain your product catalog with variants, pricing tiers,
    and inventory

    - **Customers**: Manage customer records and their subscription history

    - **Assets**: Track individual devices by serial number through their
    lifecycle

    - **Payments**: Monitor recurring payments and billing status

    - **Billing Groups**: Consolidate subscriptions for B2B customers into
    single invoices


    All endpoints require authentication via Bearer token and a Tenant-ID
    header. Responses use cursor-based pagination with `startAfter` and `limit`
    parameters.
  contact:
    name: FlexPortal Support
    url: https://www.flexportal.io
servers:
  - url: https://api-eu.flexportal.io
    description: Europe
  - url: https://api-us.flexportal.io
    description: United States
  - url: https://api-qatar.flexportal.io
    description: Qatar
security:
  - bearerAuth: []
tags:
  - name: Orders
    description: >-
      Create and manage subscription orders. Orders flow through statuses:
      pending → confirmed → partial → fulfilled. Each order contains customer
      info, line items with products, and billing/shipping addresses.
  - name: Subscriptions
    description: >-
      Manage active subscriptions (rentals). Subscriptions link customers to
      specific assets and track billing. Support lifecycle operations including
      extensions, upgrades, buyouts, and early returns.
  - name: Products
    description: >-
      Maintain your product catalog. Products have variants (e.g., different
      grades/conditions) with pricing tiers for different contract lengths.
      Supports bulk CSV import and Shopify sync.
  - name: Customers
    description: >-
      Customer records with contact info, addresses, and subscription history.
      Customers can be individuals or businesses. Automatically created when
      processing orders with new email addresses.
  - name: Assets
    description: >-
      Track physical devices/equipment by serial number. Assets flow through
      statuses: available → rented_out → returned. Link assets to subscriptions
      during order fulfillment.
  - name: Files
    description: >-
      Upload, download, and manage documents. Generate contracts from templates.
      Files are associated with orders and customers. Uses signed URLs for
      secure file transfers.
  - name: Exports
    description: >-
      Export subscription data to CSV format for reporting, accounting
      integration, or business intelligence tools. Filter by status, date range,
      or customer.
  - name: Payments
    description: >-
      Track recurring subscription payments. Payments are automatically
      generated based on billing schedules. Monitor payment status, handle
      failures, and mark manual payments as paid.
  - name: Billing Groups
    description: >-
      Consolidate multiple subscriptions into a single monthly invoice for B2B
      customers. Set a common billing day and manage subscriptions as a group.
paths:
  /v1/subscriptions/calculate-early-return-fee:
    post:
      tags:
        - Subscriptions
      summary: Calculate early return fee
      description: >-
        Calculates the early return fee for a subscription without performing
        the return.
      operationId: calculateEarlyReturnFee
      parameters:
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                rentalId:
                  type: string
                  description: The subscription ID
              required:
                - rentalId
      responses:
        '200':
          description: Early return fee calculation
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    enum:
                      - true
                  earlyReturnFee:
                    type: number
                  remainingMonths:
                    type: number
                  penaltyPercentage:
                    type: number
                required:
                  - success
                  - earlyReturnFee
                  - remainingMonths
                  - penaltyPercentage
        '404':
          description: Subscription not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
              description: Error code
            message:
              type: string
              description: Human-readable error message
          required:
            - code
            - message
      required:
        - error
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      description: API key obtained from FlexPortal dashboard

````