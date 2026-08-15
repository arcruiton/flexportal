> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Delete Asset

> Soft deletes an asset by setting status to unavailable.

## Overview

Remove an asset from your inventory. This is a **soft delete**—the asset is marked as unavailable rather than permanently removed, preserving historical data for reporting and auditing.

<Warning>
  Assets that are currently assigned to active subscriptions cannot be deleted. End or cancel the subscription first.
</Warning>

## What Happens When You Delete

1. **Asset status** changes to `unavailable`
2. **Asset removed** from available inventory queries
3. **Historical records** preserved (subscriptions, payments)
4. **Cannot be assigned** to new subscriptions

## Common Use Cases

* **Sold Assets**: Device was sold to customer (buyout)
* **Retired Inventory**: Device too old or damaged for reuse
* **Lost/Stolen**: Device cannot be recovered
* **Inventory Cleanup**: Remove test or duplicate entries

## Prerequisites

Before deleting:

1. **No active subscriptions** using this asset
2. **Asset returned** (if previously rented)

```javascript theme={null}
async function canDeleteAsset(serialNumber) {
  const asset = await getAsset(serialNumber);

  if (asset.status === 'rented_out') {
    return {
      canDelete: false,
      reason: 'Asset is currently rented',
      currentSubscription: asset.rentalId,
      currentCustomer: asset.customerId
    };
  }

  return { canDelete: true };
}
```

## Example: Delete with Reason

```javascript theme={null}
async function retireAsset(serialNumber, reason) {
  // First, update with reason for audit trail
  await updateAsset(serialNumber, {
    notes: `Retired: ${reason}`,
    status: 'unavailable'
  });

  // Then delete
  await deleteAsset(serialNumber);

  return { retired: true, serialNumber, reason };
}

// Usage
await retireAsset('SN123456789', 'End of life - 5 years old');
await retireAsset('SN987654321', 'Sold to customer via buyout');
```

## Alternative: Mark Unavailable

If you want to preserve the asset record but remove from active inventory, consider updating status instead:

```javascript theme={null}
// Instead of deleting:
await updateAsset(serialNumber, {
  status: 'unavailable',
  condition: 'Retired - end of service life',
  notes: 'Removed from fleet January 2025'
});
```

This keeps the asset fully visible in reports while preventing new assignments.

## Recovering Deleted Assets

Since deletion is a soft delete, you can reactivate assets:

```json theme={null}
PATCH /v1/assets/{serialNumber}
{
  "status": "available",
  "notes": "Reactivated after repair"
}
```

## Error Handling

| Error Code     | Cause                         | Solution               |
| -------------- | ----------------------------- | ---------------------- |
| `NOT_FOUND`    | Serial number doesn't exist   | Verify serial number   |
| `ASSET_IN_USE` | Asset has active subscription | End subscription first |

## Related Endpoints

* [Get Asset](/api-reference/assets/get) - Check asset status before deletion
* [Update Asset](/api-reference/assets/update) - Alternative: mark unavailable
* [List Assets](/api-reference/assets/list) - Find assets to delete


## OpenAPI

````yaml DELETE /v1/assets/{serialNumber}
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
  /v1/assets/{serialNumber}:
    delete:
      tags:
        - Assets
      summary: Delete an asset
      description: Soft deletes an asset by setting status to unavailable.
      operationId: deleteAsset
      parameters:
        - schema:
            type: string
            description: The asset serial number
          required: true
          name: serialNumber
          in: path
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: Asset deleted
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
                  serialNumber:
                    type: string
                required:
                  - success
                  - message
                  - serialNumber
        '404':
          description: Asset not found
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