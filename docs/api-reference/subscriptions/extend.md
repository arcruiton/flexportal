> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Extend Subscription

> Extends the subscription contract length.

## Overview

Extend an active subscription's contract period. Extensions allow customers to keep their device longer than the original contract term, typically at a reduced monthly rate.

## When to Use Extensions

| Scenario                                | Action                                              |
| --------------------------------------- | --------------------------------------------------- |
| Customer wants same device longer       | Use **Extend**                                      |
| Customer wants a different/newer device | Use [Upgrade](/api-reference/subscriptions/upgrade) |
| Customer wants to own the device        | Use [Buyout](/api-reference/subscriptions/buyout)   |

## Extension Benefits

* **For customers**: Keep familiar device at lower monthly cost
* **For operators**: Continue earning revenue on fully depreciated assets
* **For both**: No logistics costs (no return/ship new device)

## Request Fields

| Field              | Required | Description                                |
| ------------------ | -------- | ------------------------------------------ |
| `extensionMonths`  | Yes      | Number of months to extend                 |
| `newMonthlyAmount` | No       | New monthly price (default: current price) |
| `reason`           | No       | Reason for extension                       |

## Basic Example

```json theme={null}
{
  "extensionMonths": 6
}
```

## Example with Price Adjustment

```json theme={null}
{
  "extensionMonths": 12,
  "newMonthlyAmount": 79.00,
  "reason": "Loyalty discount for renewal"
}
```

<Tip>
  Extensions are a great opportunity to offer loyalty discounts. Assets are often fully paid off by the end of the initial contract, so lower extension rates can still be highly profitable.
</Tip>

## What Happens

When you extend a subscription:

1. **End date** pushed forward by extension months
2. **Contract length** updated to reflect total duration
3. **Monthly amount** updated (if new price provided)
4. **Extension history** logged with details
5. **Future payments** scheduled at new rate

## Pricing Strategy for Extensions

```javascript theme={null}
// Example: Calculate extension pricing
function calculateExtensionPrice(subscription, extensionMonths) {
  const currentMonthly = subscription.monthlyAmount;
  const costRecovery = subscription.costRecovery.costRecoveryPercent;

  if (costRecovery >= 100) {
    // Asset is paid off - offer 30% discount
    return currentMonthly * 0.7;
  } else if (costRecovery >= 80) {
    // Almost paid off - offer 20% discount
    return currentMonthly * 0.8;
  } else {
    // Still recovering costs - keep same price
    return currentMonthly;
  }
}
```

## Extension History

After extending, the subscription tracks extension history:

```json theme={null}
{
  "extensionHistory": [
    {
      "extendedAt": "2025-01-15T10:30:00Z",
      "extensionMonths": 6,
      "previousEndDate": "2025-01-31",
      "newEndDate": "2025-07-31",
      "previousMonthlyAmount": 129.00,
      "newMonthlyAmount": 99.00,
      "reason": "Customer renewal"
    }
  ]
}
```

## Common Extension Periods

| Period    | Typical Use                                 |
| --------- | ------------------------------------------- |
| 3 months  | Short-term bridge while waiting for upgrade |
| 6 months  | Standard renewal for satisfied customers    |
| 12 months | Full year renewal with loyalty discount     |
| 24 months | Long-term commitment with best pricing      |

## Error Handling

| Error Code                 | Cause                             | Solution                             |
| -------------------------- | --------------------------------- | ------------------------------------ |
| `SUBSCRIPTION_NOT_ACTIVE`  | Subscription is not active        | Can only extend active subscriptions |
| `INVALID_EXTENSION_MONTHS` | Extension months must be positive | Use positive integer                 |

## Related Endpoints

* [Get Subscription](/api-reference/subscriptions/get) - Check current subscription details
* [Upgrade Subscription](/api-reference/subscriptions/upgrade) - Upgrade to different device
* [Buyout Subscription](/api-reference/subscriptions/buyout) - Convert to purchase
* [List Subscriptions](/api-reference/subscriptions/list) - Find subscriptions to extend


## OpenAPI

````yaml POST /v1/subscriptions/{subscriptionId}/extend
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
  /v1/subscriptions/{subscriptionId}/extend:
    post:
      tags:
        - Subscriptions
      summary: Extend a subscription
      description: Extends the subscription contract length.
      operationId: extendSubscription
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
                extensionMonths:
                  type: integer
                  exclusiveMinimum: 0
                  minimum: 1
                  maximum: 120
                newMonthlyAmount:
                  type: number
                  minimum: 0
                reason:
                  type: string
                  minLength: 1
                notes:
                  type: string
              required:
                - rentalId
                - extensionMonths
                - reason
      responses:
        '200':
          description: Extension completed
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    enum:
                      - true
                  message:
                    type: string
                  rentalId:
                    type: string
                  assetSerialNumber:
                    type: string
                  oldEndDate:
                    type: string
                  newEndDate:
                    type: string
                  extensionMonths:
                    type: integer
                    minimum: 0
                    maximum: 120
                  oldContractLength:
                    type: integer
                    exclusiveMinimum: 0
                    minimum: 1
                    maximum: 120
                  newContractLength:
                    type: integer
                    exclusiveMinimum: 0
                    minimum: 1
                    maximum: 120
                required:
                  - success
                  - message
                  - rentalId
                  - assetSerialNumber
                  - oldEndDate
                  - newEndDate
                  - extensionMonths
                  - oldContractLength
                  - newContractLength
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