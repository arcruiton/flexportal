> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Replace Device

> Replaces the device on a subscription (e.g., for warranty or damage).

## Overview

Replace a faulty or damaged device with a new one of the same type. Unlike upgrades, replacements keep the same subscription terms—the customer gets a working device without changing their contract.

## When to Use Replacements

| Scenario                          | Use This                                        |
| --------------------------------- | ----------------------------------------------- |
| Device is malfunctioning          | **Replace**                                     |
| Device was damaged                | **Replace**                                     |
| Customer wants newer model        | [Upgrade](/api-reference/subscriptions/upgrade) |
| Customer wants to extend contract | [Extend](/api-reference/subscriptions/extend)   |

## Request Fields

| Field             | Required | Description                         |
| ----------------- | -------- | ----------------------------------- |
| `newSerialNumber` | Yes      | Serial number of replacement device |
| `reason`          | Yes      | Reason for replacement              |

## Example Request

```json theme={null}
{
  "newSerialNumber": "SN987654321",
  "reason": "Battery failure - device won't hold charge"
}
```

## What Happens

When you replace a device:

1. **Previous asset** status changed to `unavailable`
2. **New asset** linked to subscription and marked `rented_out`
3. **Replacement history** logged with both serial numbers
4. **Contract terms** remain unchanged
5. **Billing** continues uninterrupted

## Replacement vs Upgrade

| Aspect         | Replace        | Upgrade                |
| -------------- | -------------- | ---------------------- |
| Device         | Same model     | Different/better model |
| Contract       | Unchanged      | New contract           |
| Monthly price  | Same           | May change             |
| Typical reason | Fault/damage   | Customer request       |
| Logistics      | Same type swap | Different device       |

## Asset Requirements

The replacement serial number must:

1. **Exist** in your asset inventory
2. **Match** the same SKU as the original (same product type)
3. **Be available** (status: `available`)

## Replacement History

After replacement, the subscription tracks all swaps:

```json theme={null}
{
  "replacementHistory": [
    {
      "replacedAt": "2025-01-20T14:30:00Z",
      "previousSerialNumber": "SN123456789",
      "newSerialNumber": "SN987654321",
      "reason": "Battery failure - device won't hold charge"
    }
  ],
  "currentSerialNumber": "SN987654321"
}
```

## Example: Device Replacement Workflow

```javascript theme={null}
async function replaceDevice(subscriptionId, reason) {
  // 1. Get subscription to find SKU
  const subscription = await getSubscription(subscriptionId);

  // 2. Find available replacement of same type
  const { assets } = await listAssets({
    sku: subscription.sku,
    status: 'available',
    limit: 1
  });

  if (assets.length === 0) {
    throw new Error(`No available ${subscription.sku} in inventory`);
  }

  // 3. Process replacement
  const result = await replaceSubscriptionDevice(subscriptionId, {
    newSerialNumber: assets[0].serialNumber,
    reason
  });

  // 4. Schedule return pickup for faulty device
  await scheduleReturnPickup(subscription.serialNumber, subscription.customerId);

  return result;
}
```

## Common Replacement Reasons

Document the reason clearly for tracking and warranty purposes:

* Battery failure
* Screen damage
* Keyboard malfunction
* Performance issues
* Physical damage (specify type)
* Manufacturing defect

## Error Handling

| Error Code                | Cause                                      | Solution                                 |
| ------------------------- | ------------------------------------------ | ---------------------------------------- |
| `SUBSCRIPTION_NOT_ACTIVE` | Subscription is not active                 | Can only replace on active subscriptions |
| `ASSET_NOT_FOUND`         | Replacement serial doesn't exist           | Create asset first                       |
| `ASSET_NOT_AVAILABLE`     | Replacement asset not available            | Use different asset                      |
| `SKU_MISMATCH`            | Replacement doesn't match original product | Use same product type                    |

## Related Endpoints

* [Get Subscription](/api-reference/subscriptions/get) - Check subscription and current device
* [List Assets](/api-reference/assets/list) - Find available replacement devices
* [Upgrade Subscription](/api-reference/subscriptions/upgrade) - For changing to different product
* [Update Asset](/api-reference/assets/update) - Mark returned device for repair


## OpenAPI

````yaml POST /v1/subscriptions/{subscriptionId}/replace
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
  /v1/subscriptions/{subscriptionId}/replace:
    post:
      tags:
        - Subscriptions
      summary: Replace subscription device
      description: Replaces the device on a subscription (e.g., for warranty or damage).
      operationId: replaceSubscriptionDevice
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
                newSerialNumber:
                  type: string
                  minLength: 1
                newSku:
                  type: string
                replacementReason:
                  type: string
                  enum:
                    - damaged
                    - stolen
                    - defective
                    - lost
                damageAssessment:
                  type: string
                insuranceClaim:
                  type: boolean
                  default: false
                notes:
                  type: string
              required:
                - rentalId
                - newSerialNumber
                - replacementReason
      responses:
        '200':
          description: Device replaced
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
                  oldSerialNumber:
                    type: string
                  newSerialNumber:
                    type: string
                  reason:
                    type: string
                required:
                  - success
                  - message
                  - rentalId
                  - oldSerialNumber
                  - newSerialNumber
                  - reason
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