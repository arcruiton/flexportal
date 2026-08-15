> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Upgrade Subscription

> Upgrades the customer to a better device. Creates a new subscription and ends the current one.

## Overview

Upgrade a customer to a different (typically better) device. This ends the current subscription and creates a new order for the upgraded product. The customer returns their current device and receives a new one.

## When to Use Upgrades

| Scenario                             | Use This                                        |
| ------------------------------------ | ----------------------------------------------- |
| Customer wants newer/better device   | **Upgrade**                                     |
| Customer wants same device longer    | [Extend](/api-reference/subscriptions/extend)   |
| Current device is faulty             | [Replace](/api-reference/subscriptions/replace) |
| Customer wants to own current device | [Buyout](/api-reference/subscriptions/buyout)   |

## Upgrade Flow

```
1. Calculate upgrade terms
2. Call upgrade endpoint
3. Current subscription marked for end
4. New upgrade order created
5. Customer returns old device
6. New device shipped
7. New subscription starts
```

## Request Fields

| Field               | Required | Description                          |
| ------------------- | -------- | ------------------------------------ |
| `newSku`            | Yes      | SKU of the upgrade product           |
| `newContractLength` | Yes      | Contract length for new subscription |
| `reason`            | No       | Reason for upgrade                   |

## Example Request

```json theme={null}
{
  "newSku": "MACBOOK-PRO-16-M4",
  "newContractLength": 24,
  "reason": "Customer requested latest model"
}
```

## What Happens

When you process an upgrade:

1. **Current subscription** marked as ending (status changes on return)
2. **Upgrade order** created with type `upgrade`
3. **Order** linked to original subscription for tracking
4. **Pricing** calculated based on new variant's rates
5. **Return** scheduled for current device

## Response Structure

```json theme={null}
{
  "success": true,
  "message": "Upgrade order created",
  "upgradeOrderId": "ord_xyz789",
  "currentSubscription": {
    "subscriptionId": "sub_abc123",
    "scheduledEndDate": "2025-02-15"
  },
  "upgradeDetails": {
    "previousDevice": "MacBook Pro 16\" M3",
    "newDevice": "MacBook Pro 16\" M4",
    "previousMonthlyAmount": 129.00,
    "newMonthlyAmount": 159.00
  }
}
```

## Upgrade Pricing Considerations

Consider these factors when setting upgrade prices:

* **Remaining value** on current device
* **New device acquisition cost**
* **Market rates** for the new device
* **Customer loyalty** and history

```javascript theme={null}
// Example: Check if upgrade makes sense
async function analyzeUpgrade(subscriptionId, newSku) {
  const subscription = await getSubscription(subscriptionId);
  const newVariant = await getVariantBySku(newSku);

  return {
    currentMonthly: subscription.monthlyAmount,
    newMonthly: newVariant.pricing['24'], // 24-month price
    monthlyCostIncrease: newVariant.pricing['24'] - subscription.monthlyAmount,
    currentDeviceReturn: subscription.serialNumber,
    recommendation: newVariant.pricing['24'] > subscription.monthlyAmount
      ? 'upsell'
      : 'downgrade'
  };
}
```

## Completing the Upgrade

After calling upgrade:

1. **Process the return** of the current device
2. **Create subscription** on the upgrade order (like any new order)
3. **Ship** the new device to customer

## Error Handling

| Error Code                | Cause                                | Solution                      |
| ------------------------- | ------------------------------------ | ----------------------------- |
| `SUBSCRIPTION_NOT_ACTIVE` | Cannot upgrade inactive subscription | Check subscription status     |
| `VARIANT_NOT_FOUND`       | New SKU doesn't exist                | Verify SKU in product catalog |
| `VARIANT_INACTIVE`        | New SKU is deactivated               | Use an active variant         |
| `INVALID_CONTRACT_LENGTH` | Contract length not supported        | Use valid contract length     |

## Related Endpoints

* [Get Subscription](/api-reference/subscriptions/get) - Check current subscription
* [List Variants](/api-reference/products/variants) - Find upgrade options
* [Create Subscription](/api-reference/subscriptions/create) - Fulfill the upgrade order
* [Replace Device](/api-reference/subscriptions/replace) - For faulty device swaps (not upgrades)


## OpenAPI

````yaml POST /v1/subscriptions/{subscriptionId}/upgrade
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
  /v1/subscriptions/{subscriptionId}/upgrade:
    post:
      tags:
        - Subscriptions
      summary: Upgrade a subscription
      description: >-
        Upgrades the customer to a better device. Creates a new subscription and
        ends the current one.
      operationId: upgradeSubscription
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
                newSku:
                  type: string
                  minLength: 1
                newSerialNumber:
                  type: string
                  minLength: 1
                contractLength:
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
                - newSku
                - newSerialNumber
                - contractLength
                - newMonthlyAmount
                - reason
      responses:
        '200':
          description: Upgrade completed
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
                  oldRentalId:
                    type: string
                  newRentalId:
                    type: string
                  oldDevice:
                    type: string
                  newDevice:
                    type: string
                  newMonthlyAmount:
                    type: number
                    minimum: 0
                  currency:
                    type: string
                required:
                  - success
                  - message
                  - oldRentalId
                  - newRentalId
                  - oldDevice
                  - newDevice
                  - newMonthlyAmount
                  - currency
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