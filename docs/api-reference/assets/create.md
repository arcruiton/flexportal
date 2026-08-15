> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Create Asset

> Registers a new device/asset in inventory. Each asset is identified by a unique serial number. Assets start as "available" and can be assigned to subscriptions during order fulfillment.

## Overview

Add a new physical asset to your inventory. Assets are tracked by serial number and linked to product variants via SKU. Before you can create subscriptions, you need assets in your inventory.

<Info>
  The serial number becomes the asset's unique identifier. Use manufacturer serial numbers, asset tags, or your own numbering system—just ensure each is unique.
</Info>

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Receiving Inventory" icon="truck-ramp-box">
    Add assets as they arrive from suppliers
  </Card>

  <Card title="Warehouse Operations" icon="warehouse">
    Register assets during intake and inspection
  </Card>

  <Card title="Bulk Import" icon="file-import">
    Add multiple assets from inventory spreadsheets
  </Card>

  <Card title="Returns Processing" icon="rotate-left">
    Re-register returned/refurbished assets
  </Card>
</CardGroup>

## Request Fields

| Field             | Required | Description                                     |
| ----------------- | -------- | ----------------------------------------------- |
| `serialNumber`    | Yes      | Unique identifier (manufacturer SN or your own) |
| `sku`             | Yes      | Product variant SKU (must exist in catalog)     |
| `acquisitionCost` | No       | Your cost to acquire (used for cost recovery)   |
| `acquisitionDate` | No       | When acquired (default: today)                  |
| `location`        | No       | Physical location (warehouse name, etc.)        |
| `condition`       | No       | Condition notes                                 |
| `notes`           | No       | Additional notes                                |

## Minimal Example

```json theme={null}
{
  "serialNumber": "SN123456789",
  "sku": "MACBOOK-PRO-16-M3-18GB-SILVER"
}
```

## Complete Example

```json theme={null}
{
  "serialNumber": "C02ZX1Y2MD6T",
  "sku": "MACBOOK-PRO-16-M3-18GB-SILVER",
  "acquisitionCost": 1750.00,
  "acquisitionDate": "2025-01-15",
  "location": "Amsterdam Warehouse",
  "condition": "New in box",
  "notes": "Batch order #2025-001"
}
```

## Serial Number Best Practices

Choose a consistent serial number strategy:

| Approach        | Example              | Pros                       |
| --------------- | -------------------- | -------------------------- |
| Manufacturer SN | `C02ZX1Y2MD6T`       | Matches physical label     |
| Your numbering  | `FP-2025-00001`      | Predictable, sequential    |
| Combined        | `APPLE-C02ZX1Y2MD6T` | Searchable by manufacturer |

<Warning>
  Serial numbers must be unique within your tenant. Attempting to create an asset with an existing serial number returns a `409 Conflict` error.
</Warning>

## SKU Validation

The SKU must match an active product variant. Before creating assets:

1. Verify the SKU exists using [List Variants](/api-reference/products/variants)
2. Ensure the variant is `active`, not `inactive`

## Acquisition Cost Importance

The `acquisitionCost` is crucial for cost recovery calculations:

* If provided: Used for profitability tracking on subscriptions
* If omitted: System may use variant's default acquisition cost

```javascript theme={null}
// Example: Asset with cost tracking
await createAsset({
  serialNumber: 'SN123456789',
  sku: 'MACBOOK-PRO-16-M3-18GB-SILVER',
  acquisitionCost: 1750.00  // What you paid for this unit
});
```

## Example: Bulk Asset Creation

```javascript theme={null}
async function importAssets(assetList) {
  const results = { created: 0, errors: [] };

  for (const asset of assetList) {
    try {
      await createAsset({
        serialNumber: asset.serialNumber,
        sku: asset.sku,
        acquisitionCost: asset.cost,
        location: asset.warehouse
      });
      results.created++;
    } catch (error) {
      results.errors.push({
        serialNumber: asset.serialNumber,
        error: error.message
      });
    }
  }

  return results;
}
```

## Error Handling

| Error Code          | Cause                        | Solution                                |
| ------------------- | ---------------------------- | --------------------------------------- |
| `ASSET_EXISTS`      | Serial number already in use | Use unique serial number                |
| `VARIANT_NOT_FOUND` | SKU doesn't exist            | Create product variant first            |
| `VARIANT_INACTIVE`  | SKU is deactivated           | Reactivate variant or use different SKU |
| `VALIDATION_ERROR`  | Missing required fields      | Check serial number and SKU             |

## Related Endpoints

* [List Assets](/api-reference/assets/list) - View all assets
* [Get Asset](/api-reference/assets/get) - Verify asset was created
* [List Variants](/api-reference/products/variants) - Find valid SKUs
* [Create Subscription](/api-reference/subscriptions/create) - Use asset in subscription


## OpenAPI

````yaml POST /v1/assets
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
    post:
      tags:
        - Assets
      summary: Create an asset
      description: >-
        Registers a new device/asset in inventory. Each asset is identified by a
        unique serial number. Assets start as "available" and can be assigned to
        subscriptions during order fulfillment.
      operationId: createAsset
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
                serialNumber:
                  type: string
                  minLength: 1
                tenantId:
                  type: string
                  minLength: 1
                productId:
                  type: string
                productImageUrl:
                  type: string
                  format: uri
                variantId:
                  type: string
                sku:
                  type: string
                  minLength: 1
                productName:
                  type: string
                  minLength: 1
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
                createdAt: {}
                updatedAt: {}
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
            example:
              serialNumber: C02ZN1ABCD12
              sku: MACBOOK-PRO-16-M3-A
              productName: MacBook Pro 16" M3 Pro - Grade A
              status: available
              location: Warehouse A - Shelf 12
              notes: Received from supplier 2025-01-15
      responses:
        '201':
          description: Asset created
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
                  asset:
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
                required:
                  - success
                  - message
                  - asset
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '409':
          description: Asset already exists
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