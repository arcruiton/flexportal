> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# List Products

> Returns a paginated list of products in your catalog.

## Overview

Retrieve a paginated list of products in your catalog. Products are the parent items that contain variants—each variant represents a specific configuration (e.g., color, storage size, grade) with its own SKU and pricing.

## Product vs Variant

Understanding the product hierarchy is key:

| Concept     | Example                                   | Purpose                                     |
| ----------- | ----------------------------------------- | ------------------------------------------- |
| **Product** | MacBook Pro 16"                           | The base product/model                      |
| **Variant** | MacBook Pro 16" M3 Max, 64GB, Space Black | Specific configuration with SKU and pricing |

A product can have multiple variants, and orders reference variants by SKU.

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Product Catalog" icon="grid-2">
    Display your product catalog in e-commerce or customer-facing applications
  </Card>

  <Card title="Inventory Check" icon="warehouse">
    Verify products exist before creating orders or importing inventory
  </Card>

  <Card title="Admin Dashboard" icon="table">
    Build product management interfaces for your operations team
  </Card>

  <Card title="Sync Systems" icon="arrows-rotate">
    Keep product data synchronized with external systems
  </Card>
</CardGroup>

## Filtering Products

```bash theme={null}
# Get all active products
GET /v1/products?status=active

# Get products by category
GET /v1/products?category=laptops

# Get products by brand
GET /v1/products?brand=Apple

# Combine filters
GET /v1/products?status=active&category=laptops&brand=Apple
```

## Response Fields

Key fields in each product object:

| Field          | Description                         |
| -------------- | ----------------------------------- |
| `productId`    | Unique product identifier           |
| `productSku`   | Product-level SKU (parent SKU)      |
| `name`         | Product display name                |
| `category`     | Product category                    |
| `brand`        | Product brand/manufacturer          |
| `status`       | `active` or `discontinued`          |
| `variantCount` | Number of variants for this product |
| `createdAt`    | ISO 8601 timestamp                  |

<Info>
  Product list responses include variant counts but not full variant details. Use [Get Product](/api-reference/products/get) to retrieve a product with all its variants, or [List Variants](/api-reference/products/variants) to query variants directly.
</Info>

## Pagination

Results are paginated using cursor-based pagination. See [Pagination](/api-reference/overview#pagination) for details.

```javascript theme={null}
// Fetch all products
const allProducts = [];
let cursor = null;

do {
  const params = new URLSearchParams({ limit: '100' });
  if (cursor) params.set('startAfter', cursor);

  const { products, nextCursor } = await fetchProducts(params);
  allProducts.push(...products);
  cursor = nextCursor;
} while (cursor);
```

## Related Endpoints

* [Get Product](/api-reference/products/get) - Get product with all variants
* [List Variants](/api-reference/products/variants) - Query variants directly
* [Create Product](/api-reference/products/create) - Add new products to catalog
* [Import CSV](/api-reference/products/import-csv) - Bulk import products


## OpenAPI

````yaml GET /v1/products
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
  /v1/products:
    get:
      tags:
        - Products
      summary: List products
      description: Returns a paginated list of products in your catalog.
      operationId: listProducts
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
            description: Filter by status (active, discontinued)
          required: false
          name: status
          in: query
        - schema:
            type: string
            description: Filter by category
          required: false
          name: category
          in: query
        - schema:
            type: string
            description: Filter by brand
          required: false
          name: brand
          in: query
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: List of products
          content:
            application/json:
              schema:
                type: object
                properties:
                  products:
                    type: array
                    items:
                      type: object
                      properties:
                        productId:
                          type: string
                        tenantId:
                          type: string
                        productSku:
                          type: string
                        name:
                          type: string
                        specification:
                          type: string
                        category:
                          type: string
                        brand:
                          type: string
                        description:
                          type: string
                        images:
                          type: array
                          items:
                            type: string
                        status:
                          type: string
                          enum:
                            - active
                            - discontinued
                        _sync:
                          type: object
                          properties:
                            source:
                              type: string
                              enum:
                                - manual
                                - shopify
                                - woocommerce
                            externalId:
                              type: string
                            lastSyncedAt:
                              type: string
                            syncStatus:
                              type: string
                              enum:
                                - synced
                                - pending
                                - error
                            syncError:
                              type: string
                            readOnlyFields:
                              type: array
                              items:
                                type: string
                          required:
                            - source
                        variants:
                          type: array
                          items:
                            type: object
                            properties:
                              variantId:
                                type: string
                              tenantId:
                                type: string
                              productId:
                                type: string
                              productSku:
                                type: string
                              variantSku:
                                type: string
                              variantName:
                                type: string
                              grade:
                                type: string
                              condition:
                                type: string
                              colorName:
                                type: string
                              images:
                                type: array
                                items:
                                  type: string
                              listPrice:
                                type: number
                              acquisitionCost:
                                type: number
                              pricing:
                                type: array
                                items:
                                  type: object
                                  properties:
                                    contractLength:
                                      type: number
                                    monthlyPrice:
                                      type: number
                                    setupFee:
                                      type: number
                                    discount:
                                      type: object
                                      properties:
                                        type:
                                          type: string
                                          enum:
                                            - percentage
                                            - fixed
                                        value:
                                          type: number
                                        description:
                                          type: string
                                      required:
                                        - type
                                        - value
                                    source:
                                      type: string
                                      enum:
                                        - suggested
                                        - manual
                                    calculatedAt:
                                      type: string
                                    presetUsed:
                                      type: string
                                  required:
                                    - contractLength
                                    - monthlyPrice
                              status:
                                type: string
                                enum:
                                  - active
                                  - inactive
                              createdAt:
                                type: string
                              updatedAt:
                                type: string
                            required:
                              - variantId
                              - tenantId
                              - productId
                              - productSku
                              - variantSku
                              - variantName
                              - grade
                              - pricing
                              - status
                              - createdAt
                              - updatedAt
                        createdAt:
                          type: string
                        updatedAt:
                          type: string
                      required:
                        - productId
                        - tenantId
                        - productSku
                        - name
                        - specification
                        - category
                        - brand
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
                  - products
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