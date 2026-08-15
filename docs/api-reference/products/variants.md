> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# List Variants

> Returns all product variants. Useful for building pricing tables or dropdowns.

## Overview

Query variants across all products. Unlike [Get Product](/api-reference/products/get) which returns variants for a single product, this endpoint lets you search, filter, and paginate across your entire variant catalog.

## When to Use This Endpoint

| Use Case                          | Recommended Endpoint                       |
| --------------------------------- | ------------------------------------------ |
| Get variants for one product      | [Get Product](/api-reference/products/get) |
| Search variants by SKU            | **List Variants**                          |
| Filter variants by grade/status   | **List Variants**                          |
| Build variant search/autocomplete | **List Variants**                          |
| Export variant catalog            | **List Variants**                          |

## Common Use Cases

<CardGroup cols={2}>
  <Card title="SKU Lookup" icon="magnifying-glass">
    Find variant details by SKU for order validation or inventory management
  </Card>

  <Card title="Inventory View" icon="warehouse">
    Display all variants with pricing for warehouse or operations teams
  </Card>

  <Card title="Grade Filtering" icon="star">
    Find all Grade B or Grade C variants for promotional pricing
  </Card>

  <Card title="Bulk Export" icon="file-export">
    Export complete variant catalog for external systems
  </Card>
</CardGroup>

## Filtering Variants

```bash theme={null}
# Get all active variants
GET /v1/products/variants?status=active

# Filter by grade
GET /v1/products/variants?grade=A

# Filter by category (from parent product)
GET /v1/products/variants?category=Laptops

# Find specific SKU
GET /v1/products/variants?sku=MACBOOK-PRO-16-M3

# Combine filters
GET /v1/products/variants?status=active&grade=A&brand=Apple
```

## Response Fields

Each variant includes:

| Field             | Description                       |
| ----------------- | --------------------------------- |
| `variantId`       | Unique variant identifier         |
| `sku`             | Variant SKU (used in orders)      |
| `productId`       | Parent product ID                 |
| `productName`     | Parent product name               |
| `specification`   | Technical specification           |
| `grade`           | Condition grade (A-E)             |
| `color`           | Color option                      |
| `status`          | `active` or `inactive`            |
| `listPrice`       | MSRP/retail price                 |
| `acquisitionCost` | Your cost to acquire              |
| `pricing`         | Monthly prices by contract length |

## Pagination

This endpoint supports higher limits for bulk operations:

| Parameter    | Default | Maximum                       |
| ------------ | ------- | ----------------------------- |
| `limit`      | 50      | 5,000                         |
| `startAfter` | —       | Cursor from previous response |

```bash theme={null}
# Fetch up to 1,000 variants at once
GET /v1/products/variants?limit=1000&status=active
```

## Example: Build SKU Autocomplete

```javascript theme={null}
async function searchVariants(query) {
  // Search variants where SKU starts with query
  const { variants } = await listVariants({
    sku: query,  // Partial match support
    status: 'active',
    limit: 10
  });

  return variants.map(v => ({
    sku: v.sku,
    label: `${v.productName} - ${v.specification}`,
    price24mo: v.pricing['24']
  }));
}

// Usage
const results = await searchVariants('MACBOOK');
// Returns matching MacBook variants for autocomplete
```

## Example: Export Pricing Catalog

```javascript theme={null}
async function exportPricingCatalog() {
  const allVariants = [];
  let cursor = null;

  do {
    const params = {
      status: 'active',
      limit: 1000
    };
    if (cursor) params.startAfter = cursor;

    const { variants, nextCursor } = await listVariants(params);
    allVariants.push(...variants);
    cursor = nextCursor;
  } while (cursor);

  // Transform for export
  return allVariants.map(v => ({
    sku: v.sku,
    product: v.productName,
    spec: v.specification,
    grade: v.grade,
    listPrice: v.listPrice,
    cost: v.acquisitionCost,
    price6mo: v.pricing['6'],
    price12mo: v.pricing['12'],
    price24mo: v.pricing['24'],
    price36mo: v.pricing['36']
  }));
}
```

## Related Endpoints

* [Get Product](/api-reference/products/get) - Get variants for specific product
* [Create Product](/api-reference/products/create) - Add new variants via product
* [Update Product](/api-reference/products/update) - Modify variant details


## OpenAPI

````yaml GET /v1/products/variants
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
  /v1/products/variants:
    get:
      tags:
        - Products
      summary: List all variants
      description: >-
        Returns all product variants. Useful for building pricing tables or
        dropdowns.
      operationId: listVariants
      parameters:
        - schema:
            type: string
            description: 'Items per page (default: 5000, max: 5000)'
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
            description: Filter by status (active, inactive)
          required: false
          name: status
          in: query
        - schema:
            type: string
            description: Filter by product SKU
          required: false
          name: productSku
          in: query
        - schema:
            type: string
            description: Filter by grade (A, B, C, D, E)
          required: false
          name: grade
          in: query
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: List of variants
          content:
            application/json:
              schema:
                type: object
                properties:
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
                  - variants
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