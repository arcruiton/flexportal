> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Buyout Subscription

> Customer purchases the device, ending the subscription.

## Overview

Process a buyout to convert a subscription into a purchase. The customer pays a buyout price and keeps the device permanently. This ends the subscription and transfers ownership of the asset.

## When to Offer Buyouts

| Scenario             | Buyout Makes Sense                           |
| -------------------- | -------------------------------------------- |
| Near end of contract | Customer wants to keep device                |
| Cost fully recovered | Asset is paid off, buyout is pure profit     |
| Customer preference  | Customer prefers ownership                   |
| Old inventory        | Simplify operations by selling older devices |

## Buyout Pricing

Before processing a buyout, calculate the price using [Calculate Buyout](/api-reference/subscriptions/calculate-buyout). Buyout prices typically consider:

* **Remaining contract value**: Unpaid months × monthly rate
* **Residual value**: Expected asset value at contract end
* **Cost recovery status**: How much you've already collected

```javascript theme={null}
// Common buyout formula
const remainingMonths = subscription.monthsRemaining;
const monthlyAmount = subscription.monthlyAmount;
const residualValue = 200; // Tenant-configured minimum

const buyoutPrice = (remainingMonths * monthlyAmount) + residualValue;
```

## Request Fields

| Field           | Required | Description                               |
| --------------- | -------- | ----------------------------------------- |
| `buyoutPrice`   | Yes      | The buyout amount to charge               |
| `effectiveDate` | No       | When ownership transfers (default: today) |
| `reason`        | No       | Reason for buyout                         |

## Example Request

```json theme={null}
{
  "buyoutPrice": 450.00,
  "reason": "Customer requested purchase at contract end"
}
```

## What Happens

When you process a buyout:

1. **Subscription status** changes to `ended_buyout`
2. **Asset ownership** transferred to customer
3. **Asset status** changed to `sold` or `unavailable`
4. **Buyout details** recorded on subscription
5. **Future payments** cancelled
6. **Final invoice** generated for buyout amount

## Response Structure

```json theme={null}
{
  "success": true,
  "message": "Buyout processed successfully",
  "subscription": {
    "subscriptionId": "sub_abc123",
    "status": "ended_buyout",
    "buyoutDetails": {
      "buyoutDate": "2025-01-20",
      "buyoutPrice": 450.00,
      "remainingMonths": 6,
      "costRecoveryAtBuyout": 95.5
    }
  }
}
```

## Buyout Workflow

```
1. Customer requests buyout
2. Calculate buyout price → /calculate-buyout
3. Present price to customer
4. Customer agrees and pays
5. Process buyout → /buyout
6. Send ownership confirmation
7. Update asset records
```

## Example: End-to-End Buyout

```javascript theme={null}
async function processBuyout(subscriptionId) {
  // 1. Calculate buyout price
  const quote = await calculateBuyout(subscriptionId);

  // 2. Present to customer (in your UI)
  console.log(`Buyout price: €${quote.buyoutPrice}`);

  // 3. After customer payment confirmed, process buyout
  const result = await buyoutSubscription(subscriptionId, {
    buyoutPrice: quote.buyoutPrice,
    reason: 'Customer purchase request'
  });

  return result;
}
```

## Buyout vs Early Return

| Aspect   | Buyout                   | Early Return              |
| -------- | ------------------------ | ------------------------- |
| Device   | Customer keeps           | Device returned           |
| Payment  | Buyout price             | Early return fee          |
| Asset    | Removed from inventory   | Returns to inventory      |
| Best for | Customer wants ownership | Customer done with device |

## Error Handling

| Error Code                | Cause                         | Solution                             |
| ------------------------- | ----------------------------- | ------------------------------------ |
| `SUBSCRIPTION_NOT_ACTIVE` | Subscription is not active    | Can only buyout active subscriptions |
| `INVALID_BUYOUT_PRICE`    | Buyout price must be positive | Provide valid price                  |

## Related Endpoints

* [Calculate Buyout](/api-reference/subscriptions/calculate-buyout) - Get recommended buyout price
* [Get Subscription](/api-reference/subscriptions/get) - Check subscription details
* [Early Return](/api-reference/subscriptions/early-return) - Alternative: return device early


## OpenAPI

````yaml POST /v1/subscriptions/{subscriptionId}/buyout
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
  /v1/subscriptions/{subscriptionId}/buyout:
    post:
      tags:
        - Subscriptions
      summary: Buyout a subscription
      description: Customer purchases the device, ending the subscription.
      operationId: buyoutSubscription
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
                buyoutPrice:
                  type: number
                  minimum: 0
                reason:
                  type: string
                  enum:
                    - customer_request
                    - end_of_contract
                    - other
                notes:
                  type: string
              required:
                - rentalId
                - reason
      responses:
        '200':
          description: Buyout completed
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
                  buyoutPrice:
                    type: number
                    minimum: 0
                  currency:
                    type: string
                  effectiveDate:
                    type: string
                  message:
                    type: string
                required:
                  - success
                  - rentalId
                  - assetSerialNumber
                  - buyoutPrice
                  - currency
                  - effectiveDate
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