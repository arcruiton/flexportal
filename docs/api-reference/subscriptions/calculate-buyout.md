> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Calculate Buyout Price

> Calculates the buyout price for a subscription without performing the buyout.

## Overview

Calculate the buyout price for a subscription before processing the actual buyout. This endpoint returns a recommended price based on remaining contract value and configured residual rates—use it to present buyout options to customers.

<Info>
  This is a **read-only calculation**—it doesn't modify the subscription. Call [Buyout Subscription](/api-reference/subscriptions/buyout) to actually process the buyout.
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
    "buyoutPrice": 658.00,
    "breakdown": {
      "remainingContractValue": 516.00,
      "residualValue": 142.00,
      "monthsRemaining": 4,
      "monthlyAmount": 129.00
    },
    "costRecovery": {
      "acquisitionCost": 1800.00,
      "totalCollected": 1548.00,
      "projectedAfterBuyout": 2206.00,
      "projectedMargin": 406.00,
      "marginPercent": 22.6
    }
  }
}
```

## Understanding the Calculation

### Remaining Contract Value

The value of remaining payments:

```
remainingContractValue = monthsRemaining × monthlyAmount
```

### Residual Value

The minimum asset value at contract end, typically:

* A percentage of acquisition cost (e.g., 5-15%)
* Or a fixed minimum amount
* Configured in tenant settings

### Buyout Price

```
buyoutPrice = remainingContractValue + residualValue
```

## Common Use Cases

### 1. Quoting Customers

```javascript theme={null}
async function getBuyoutQuote(subscriptionId) {
  const calc = await calculateBuyout({ subscriptionId });

  return {
    price: calc.calculation.buyoutPrice,
    monthsLeft: calc.calculation.breakdown.monthsRemaining,
    savedMonths: calc.calculation.breakdown.monthsRemaining,
    message: `Buy now for €${calc.calculation.buyoutPrice} (saves ${calc.calculation.breakdown.monthsRemaining} months of payments)`
  };
}
```

### 2. Evaluating Profitability

```javascript theme={null}
async function shouldOfferBuyout(subscriptionId) {
  const calc = await calculateBuyout({ subscriptionId });

  const marginPercent = calc.calculation.costRecovery.marginPercent;

  return {
    recommend: marginPercent > 15, // Only offer if > 15% margin
    margin: marginPercent,
    buyoutPrice: calc.calculation.buyoutPrice
  };
}
```

### 3. Bulk Analysis

```javascript theme={null}
async function analyzeBuyoutOpportunities() {
  // Get subscriptions ending in next 3 months
  const { subscriptions } = await listSubscriptions({
    status: 'active',
    endDateTo: threeMonthsFromNow
  });

  const opportunities = [];

  for (const sub of subscriptions) {
    const calc = await calculateBuyout({ subscriptionId: sub.subscriptionId });

    if (calc.calculation.costRecovery.marginPercent > 20) {
      opportunities.push({
        subscriptionId: sub.subscriptionId,
        customer: sub.customerId,
        product: sub.productName,
        buyoutPrice: calc.calculation.buyoutPrice,
        margin: calc.calculation.costRecovery.marginPercent
      });
    }
  }

  return opportunities;
}
```

## Presentation Tips

When showing buyout prices to customers:

* **Highlight savings**: Show total remaining payments vs buyout price
* **Ownership benefits**: Emphasize they keep the device forever
* **No more payments**: Monthly billing stops after buyout
* **Immediate**: They can own it today

## Related Endpoints

* [Buyout Subscription](/api-reference/subscriptions/buyout) - Process the actual buyout
* [Get Subscription](/api-reference/subscriptions/get) - Get subscription details
* [Calculate Early Return](/api-reference/subscriptions/calculate-early-return) - Alternative: early return fee


## OpenAPI

````yaml POST /v1/subscriptions/calculate-buyout
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
  /v1/subscriptions/calculate-buyout:
    post:
      tags:
        - Subscriptions
      summary: Calculate buyout price
      description: >-
        Calculates the buyout price for a subscription without performing the
        buyout.
      operationId: calculateBuyoutPrice
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
          description: Buyout calculation
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    enum:
                      - true
                  buyoutPrice:
                    type: number
                  remainingPayments:
                    type: number
                  depreciatedValue:
                    type: number
                required:
                  - success
                  - buyoutPrice
                  - remainingPayments
                  - depreciatedValue
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