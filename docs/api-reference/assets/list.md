> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# List Assets

> Returns a paginated list of assets in inventory.

## Overview

Retrieve a paginated list of assets with optional filtering and sorting. Assets represent individual physical units tracked by serial number—laptops, phones, e-bikes, or any subscribable equipment in your inventory.

## Asset Lifecycle

```
Created → Available → Rented Out → [Returned] → Available/Unavailable
```

Assets move through statuses as they're used in subscriptions:

| Status        | Description                                  |
| ------------- | -------------------------------------------- |
| `available`   | Ready to be assigned to a subscription       |
| `rented_out`  | Currently assigned to an active subscription |
| `unavailable` | Not available (sold, damaged, retired, etc.) |

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Inventory Management" icon="warehouse">
    Track all assets across locations and statuses
  </Card>

  <Card title="Order Fulfillment" icon="truck">
    Find available assets to assign to new subscriptions
  </Card>

  <Card title="Asset Tracking" icon="location-dot">
    Monitor which devices are rented and to whom
  </Card>

  <Card title="Reporting" icon="chart-bar">
    Generate inventory reports by status, SKU, or location
  </Card>
</CardGroup>

## Filtering Assets

```bash theme={null}
# Get available assets ready for orders
GET /v1/assets?status=available

# Get assets by SKU
GET /v1/assets?sku=MACBOOK-PRO-16-M3

# Get rented assets for a specific customer
GET /v1/assets?status=rented_out&customerId=cust_abc123

# Get assets linked to a subscription
GET /v1/assets?rentalId=sub_xyz789

# Combine filters
GET /v1/assets?status=available&sku=MACBOOK-PRO-16-M3&sortBy=createdAt
```

## Sorting Options

| Field          | Description                   |
| -------------- | ----------------------------- |
| `createdAt`    | Asset creation date (default) |
| `updatedAt`    | Last modification date        |
| `serialNumber` | Serial number alphabetically  |
| `status`       | Asset status                  |
| `sku`          | Product SKU                   |

## Response Fields

Key fields in each asset object:

| Field             | Description                           |
| ----------------- | ------------------------------------- |
| `serialNumber`    | Unique asset identifier               |
| `sku`             | Product variant SKU                   |
| `productName`     | Product display name                  |
| `status`          | Current asset status                  |
| `acquisitionCost` | Your cost to acquire this asset       |
| `customerId`      | Current customer (if assigned)        |
| `rentalId`        | Current subscription ID (if assigned) |
| `location`        | Physical location (warehouse, etc.)   |
| `notes`           | Additional notes                      |
| `createdAt`       | ISO 8601 timestamp                    |

## Example: Find Available Assets for Order

```javascript theme={null}
async function findAssetsForOrder(sku, quantity) {
  const { assets } = await listAssets({
    sku,
    status: 'available',
    limit: quantity
  });

  if (assets.length < quantity) {
    return {
      available: assets.length,
      needed: quantity,
      shortfall: quantity - assets.length,
      message: `Only ${assets.length} of ${quantity} ${sku} available`
    };
  }

  return {
    assets: assets.map(a => a.serialNumber),
    ready: true
  };
}
```

## Example: Inventory Summary

```javascript theme={null}
async function getInventorySummary() {
  const [available, rentedOut, unavailable] = await Promise.all([
    listAssets({ status: 'available', limit: 1 }),
    listAssets({ status: 'rented_out', limit: 1 }),
    listAssets({ status: 'unavailable', limit: 1 })
  ]);

  return {
    available: available.count,
    rentedOut: rentedOut.count,
    unavailable: unavailable.count,
    total: available.count + rentedOut.count + unavailable.count
  };
}
```

## Related Endpoints

* [Get Asset](/api-reference/assets/get) - Get single asset details
* [Create Asset](/api-reference/assets/create) - Add new asset to inventory
* [Update Asset](/api-reference/assets/update) - Modify asset details
* [Create Subscription](/api-reference/subscriptions/create) - Assign asset to subscription


## OpenAPI

````yaml GET /v1/assets
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
  /v1/assets:
    get:
      tags:
        - Assets
      summary: List assets
      description: Returns a paginated list of assets in inventory.
      operationId: listAssets
      parameters:
        - schema:
            type: string
            description: 'Items per page (default: 50, max: 100)'
          required: false
          name: limit
          in: query
        - schema:
            type: string
            description: Cursor for pagination
          required: false
          name: startAfter
          in: query
        - schema:
            type: string
            description: >-
              Filter by status (available, rented_out, returned, sold,
              unavailable)
          required: false
          name: status
          in: query
        - schema:
            type: string
            description: Filter by product SKU
          required: false
          name: sku
          in: query
        - schema:
            type: string
            description: Filter by customer ID
          required: false
          name: customerId
          in: query
        - schema:
            type: string
            description: Filter by rental ID
          required: false
          name: rentalId
          in: query
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: List of assets
          content:
            application/json:
              schema:
                type: object
                properties:
                  assets:
                    type: array
                    items:
                      type: object
                      properties:
                        serialNumber:
                          type: string
                        tenantId:
                          type: string
                        productId:
                          type: string
                        productImageUrl:
                          type: string
                        variantId:
                          type: string
                        sku:
                          type: string
                        productName:
                          type: string
                        status:
                          type: string
                          enum:
                            - available
                            - rented_out
                            - returned
                            - sold
                            - unavailable
                        location:
                          type: string
                        customerId:
                          type: string
                        rentalId:
                          type: string
                        createdAt:
                          type: string
                        updatedAt:
                          type: string
                        notes:
                          type: string
                      required:
                        - serialNumber
                        - tenantId
                        - sku
                        - productName
                        - status
                        - createdAt
                        - updatedAt
                  count:
                    type: number
                  limit:
                    type: number
                  hasMore:
                    type: boolean
                  nextCursor:
                    type:
                      - string
                      - 'null'
                required:
                  - assets
                  - count
                  - limit
                  - hasMore
                  - nextCursor
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      description: API key obtained from FlexPortal dashboard

````