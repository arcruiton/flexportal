> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Asset

> Retrieves a specific asset by serial number.

## Overview

Retrieve details for a single asset by its serial number. Assets are identified by their unique serial number (not an auto-generated ID), making it easy to look up devices using manufacturer serial numbers or your own identifiers.

## Common Use Cases

* **Warehouse Lookup**: Scan a barcode/serial number to get asset details
* **Support Queries**: Find asset info during customer support calls
* **Pre-Assignment Check**: Verify asset details before creating a subscription
* **Audit Trail**: Track asset history and current assignment

## Response Fields

| Field             | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| `serialNumber`    | Unique asset identifier                                         |
| `sku`             | Product variant SKU                                             |
| `productName`     | Product display name                                            |
| `status`          | `available`, `rented_out`, `returned`, `sold`, or `unavailable` |
| `acquisitionCost` | Your cost to acquire                                            |
| `acquisitionDate` | When the asset was acquired                                     |
| `customerId`      | Current customer (if assigned)                                  |
| `rentalId`        | Current subscription ID (if assigned)                           |
| `location`        | Physical location                                               |
| `condition`       | Asset condition notes                                           |
| `notes`           | Additional notes                                                |
| `createdAt`       | When asset was added to system                                  |
| `updatedAt`       | Last modification timestamp                                     |

## Asset Status Details

| Status        | Meaning                  | Typical Scenario                     |
| ------------- | ------------------------ | ------------------------------------ |
| `available`   | Ready for subscription   | In warehouse, ready to ship          |
| `rented_out`  | Assigned to subscription | With customer                        |
| `unavailable` | Not available            | Damaged, sold, retired, or in repair |

## Example: Warehouse Scan Lookup

```javascript theme={null}
async function handleBarcodeScan(serialNumber) {
  try {
    const asset = await getAsset(serialNumber);

    return {
      found: true,
      product: asset.productName,
      sku: asset.sku,
      status: asset.status,
      location: asset.location,
      canAssign: asset.status === 'available',
      currentCustomer: asset.customerId || null
    };
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return { found: false, serialNumber };
    }
    throw error;
  }
}
```

## Example: Check Before Assignment

```javascript theme={null}
async function canAssignToOrder(serialNumber, orderSku) {
  const asset = await getAsset(serialNumber);

  const issues = [];

  if (asset.status !== 'available') {
    issues.push(`Asset is ${asset.status}, not available`);
  }

  if (asset.sku !== orderSku) {
    issues.push(`SKU mismatch: asset is ${asset.sku}, order needs ${orderSku}`);
  }

  return {
    canAssign: issues.length === 0,
    issues
  };
}
```

## Related Endpoints

* [List Assets](/api-reference/assets/list) - Browse all assets
* [Update Asset](/api-reference/assets/update) - Modify asset details
* [Create Subscription](/api-reference/subscriptions/create) - Assign asset to subscription
* [Get Subscription](/api-reference/subscriptions/get) - View subscription using this asset


## OpenAPI

````yaml GET /v1/assets/{serialNumber}
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
    get:
      tags:
        - Assets
      summary: Get an asset
      description: Retrieves a specific asset by serial number.
      operationId: getAsset
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
          description: Asset details
          content:
            application/json:
              schema:
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