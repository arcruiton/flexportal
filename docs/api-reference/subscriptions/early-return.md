> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Early Return

> Customer returns the device before contract end. May incur early return fees.

## Overview

Process an early return when a customer wants to end their subscription before the contract end date. The customer returns the device and may pay an early termination fee based on your policies.

## When to Use Early Returns

| Scenario                        | Use Early Return                                       |
| ------------------------------- | ------------------------------------------------------ |
| Customer no longer needs device | Yes                                                    |
| Customer moving/relocating      | Yes                                                    |
| Financial hardship              | Yes (consider waiving fee)                             |
| Device issues                   | No—use [Replace](/api-reference/subscriptions/replace) |
| Customer wants to own device    | No—use [Buyout](/api-reference/subscriptions/buyout)   |

## Early Return vs Buyout

| Aspect   | Early Return              | Buyout                   |
| -------- | ------------------------- | ------------------------ |
| Device   | Returned to you           | Customer keeps           |
| Fee      | Early termination fee     | Buyout price             |
| Asset    | Back in inventory         | Removed from inventory   |
| Best for | Customer done with device | Customer wants ownership |

## Request Fields

| Field            | Required | Description                             |
| ---------------- | -------- | --------------------------------------- |
| `earlyReturnFee` | Yes      | The fee to charge                       |
| `effectiveDate`  | No       | When subscription ends (default: today) |
| `reason`         | No       | Reason for early return                 |
| `waiveFee`       | No       | Set to `true` to waive the fee          |

## Example: Standard Early Return

```json theme={null}
{
  "earlyReturnFee": 258.00,
  "reason": "Customer relocating abroad"
}
```

## Example: Waived Fee (Customer Goodwill)

```json theme={null}
{
  "earlyReturnFee": 0,
  "waiveFee": true,
  "reason": "Customer hardship - fee waived per manager approval"
}
```

## What Happens

When you process an early return:

1. **Subscription status** changes to `ended_early_return`
2. **Early return details** recorded with fee and reason
3. **Future payments** cancelled
4. **Asset** marked for return processing
5. **Final invoice** generated for early return fee (if applicable)

## Response Structure

```json theme={null}
{
  "success": true,
  "message": "Early return processed",
  "subscription": {
    "subscriptionId": "sub_abc123",
    "status": "ended_early_return",
    "earlyReturnDetails": {
      "returnDate": "2025-01-20",
      "earlyReturnFee": 258.00,
      "monthsRemaining": 4,
      "feeWaived": false,
      "reason": "Customer relocating abroad"
    }
  }
}
```

## Calculate Before Processing

Always calculate the fee first using [Calculate Early Return Fee](/api-reference/subscriptions/calculate-early-return):

```javascript theme={null}
async function processEarlyReturn(subscriptionId, reason) {
  // 1. Calculate the fee
  const calc = await calculateEarlyReturnFee({ subscriptionId });

  // 2. Present to customer and get confirmation
  const confirmed = await confirmWithCustomer(calc.earlyReturnFee);

  if (!confirmed) {
    return { cancelled: true };
  }

  // 3. Process the return
  return await earlyReturnSubscription(subscriptionId, {
    earlyReturnFee: calc.earlyReturnFee,
    reason
  });
}
```

## Early Return Fee Policies

Common approaches for calculating early return fees:

### 1. Remaining Contract Value

```
fee = remainingMonths × monthlyAmount
```

### 2. Percentage of Remaining

```
fee = remainingMonths × monthlyAmount × 0.5  // 50% of remaining
```

### 3. Fixed Early Exit Fee

```
fee = configuredFixedFee  // e.g., €200 flat fee
```

### 4. Sliding Scale

```javascript theme={null}
if (monthsRemaining > 12) {
  fee = monthlyAmount * 3;  // 3 months penalty
} else if (monthsRemaining > 6) {
  fee = monthlyAmount * 2;  // 2 months penalty
} else {
  fee = monthlyAmount;      // 1 month penalty
}
```

## Completing the Early Return

After processing:

1. **Schedule return pickup** or provide return instructions
2. **Receive device** from customer
3. **Inspect device** for damage
4. **Update asset** status (available or needs repair)
5. **Process fee payment** if applicable

## Error Handling

| Error Code                | Cause                        | Solution                                   |
| ------------------------- | ---------------------------- | ------------------------------------------ |
| `SUBSCRIPTION_NOT_ACTIVE` | Subscription is not active   | Can only early return active subscriptions |
| `INVALID_FEE`             | Fee must be zero or positive | Provide valid fee amount                   |

## Related Endpoints

* [Calculate Early Return Fee](/api-reference/subscriptions/calculate-early-return) - Get recommended fee
* [Get Subscription](/api-reference/subscriptions/get) - Check subscription details
* [Buyout Subscription](/api-reference/subscriptions/buyout) - Alternative: customer keeps device
* [Update Asset](/api-reference/assets/update) - Update returned device status


## OpenAPI

````yaml POST /v1/subscriptions/{subscriptionId}/early-return
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
  /v1/subscriptions/{subscriptionId}/early-return:
    post:
      tags:
        - Subscriptions
      summary: Early return a subscription
      description: >-
        Customer returns the device before contract end. May incur early return
        fees.
      operationId: earlyReturnSubscription
      parameters:
        - schema:
            type: string
            description: The subscription ID
          required: true
          name: subscriptionId
          in: path
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
                  minLength: 1
                returnCondition:
                  type: string
                  enum:
                    - excellent
                    - good
                    - fair
                    - poor
                    - damaged
                earlyReturnFee:
                  type: number
                  minimum: 0
                reason:
                  type: string
                  minLength: 1
                damageAssessment:
                  type: string
                notes:
                  type: string
              required:
                - rentalId
                - returnCondition
                - reason
      responses:
        '200':
          description: Early return completed
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  rentalId:
                    type: string
                  assetSerialNumber:
                    type: string
                  earlyReturnFee:
                    type: number
                    minimum: 0
                  currency:
                    type: string
                  actualMonthsRented:
                    type: integer
                    minimum: 0
                    maximum: 120
                  returnDate:
                    type: string
                  message:
                    type: string
                required:
                  - success
                  - rentalId
                  - assetSerialNumber
                  - earlyReturnFee
                  - currency
                  - actualMonthsRented
                  - returnDate
                  - message
        '400':
          description: Bad request
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