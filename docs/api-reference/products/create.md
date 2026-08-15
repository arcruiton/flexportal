> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Create Product

> Creates a new product with its variants. Uses upsert logic - will update if product SKU already exists. Products can have multiple variants representing different conditions/grades, each with their own pricing tiers for different contract lengths.

## Overview

Create a new product with one or more variants. Products are the foundation of your subscription catalog—they define what customers can subscribe to, at what prices, and with what configurations.

<Info>
  This endpoint uses **upsert behavior**: if a product with the same `productSku` already exists, it will be updated instead of creating a duplicate.
</Info>

## Common Use Cases

<CardGroup cols={2}>
  <Card title="New Product Launch" icon="rocket">
    Add new products to your catalog when expanding your offering
  </Card>

  <Card title="Integration Sync" icon="plug">
    Sync products from your e-commerce platform or inventory system
  </Card>

  <Card title="Catalog Migration" icon="database">
    Migrate products from another subscription platform
  </Card>

  <Card title="Partner Catalog" icon="handshake">
    Onboard products from new suppliers or partners
  </Card>
</CardGroup>

## Minimal Request Example

Create a simple product with one variant:

```json theme={null}
{
  "productSku": "MACBOOK-PRO-16",
  "name": "MacBook Pro 16\"",
  "specification": "Apple Silicon laptop",
  "category": "Laptops",
  "brand": "Apple",
  "variants": [
    {
      "variantSku": "MACBOOK-PRO-16-M3-BASE",
      "variantName": "M3 Pro, 18GB RAM, 512GB SSD",
      "grade": "A",
      "listPrice": 2499.00,
      "acquisitionCost": 1800.00,
      "pricing": [
        { "contractLength": 12, "monthlyPrice": 159.00 },
        { "contractLength": 24, "monthlyPrice": 129.00 },
        { "contractLength": 36, "monthlyPrice": 109.00 }
      ]
    }
  ]
}
```

## Complete Request Example

Product with multiple variants for different configurations:

```json theme={null}
{
  "productSku": "MACBOOK-PRO-16",
  "name": "MacBook Pro 16\"",
  "specification": "Apple Silicon laptop",
  "category": "Laptops",
  "brand": "Apple",
  "description": "Professional laptop for creative and development work",
  "images": ["https://example.com/images/macbook-pro-16.jpg"],
  "variants": [
    {
      "variantSku": "MACBOOK-PRO-16-M3-18GB-SILVER",
      "variantName": "M3 Pro, 18GB RAM, 512GB SSD",
      "grade": "A",
      "colorName": "Silver",
      "listPrice": 2499.00,
      "acquisitionCost": 1800.00,
      "pricing": [
        { "contractLength": 6, "monthlyPrice": 199.00 },
        { "contractLength": 12, "monthlyPrice": 159.00 },
        { "contractLength": 24, "monthlyPrice": 129.00 },
        { "contractLength": 36, "monthlyPrice": 109.00 }
      ]
    },
    {
      "variantSku": "MACBOOK-PRO-16-M3MAX-64GB-BLACK",
      "variantName": "M3 Max, 64GB RAM, 1TB SSD",
      "grade": "A",
      "colorName": "Space Black",
      "listPrice": 3999.00,
      "acquisitionCost": 2800.00,
      "pricing": [
        { "contractLength": 6, "monthlyPrice": 319.00 },
        { "contractLength": 12, "monthlyPrice": 249.00 },
        { "contractLength": 24, "monthlyPrice": 199.00 },
        { "contractLength": 36, "monthlyPrice": 169.00 }
      ]
    },
    {
      "variantSku": "MACBOOK-PRO-16-M3-18GB-SILVER-B",
      "variantName": "M3 Pro, 18GB RAM, 512GB SSD",
      "grade": "B",
      "colorName": "Silver",
      "listPrice": 2499.00,
      "acquisitionCost": 1500.00,
      "pricing": [
        { "contractLength": 12, "monthlyPrice": 139.00 },
        { "contractLength": 24, "monthlyPrice": 109.00 },
        { "contractLength": 36, "monthlyPrice": 89.00 }
      ]
    }
  ]
}
```

## Product Fields

| Field           | Required | Description                                  |
| --------------- | -------- | -------------------------------------------- |
| `productSku`    | Yes      | Unique product identifier (parent SKU)       |
| `name`          | Yes      | Display name                                 |
| `specification` | Yes      | Product specification/description            |
| `category`      | Yes      | Product category (e.g., "Laptops", "Phones") |
| `brand`         | Yes      | Brand/manufacturer                           |
| `description`   | No       | Detailed product description                 |
| `images`        | No       | Array of product image URLs                  |
| `variants`      | Yes      | Array of variant configurations              |

## Variant Fields

| Field             | Required | Description                         |
| ----------------- | -------- | ----------------------------------- |
| `variantSku`      | Yes      | Unique variant SKU (used in orders) |
| `variantName`     | Yes      | Variant name/specification          |
| `grade`           | Yes      | Condition: A, B, C, D, or E         |
| `colorName`       | No       | Color option                        |
| `listPrice`       | No       | MSRP/retail price                   |
| `acquisitionCost` | No       | Your cost to acquire                |
| `pricing`         | Yes      | Array of pricing tiers (see below)  |

## Pricing Array Format

Each pricing tier in the `pricing` array:

| Field            | Required | Description                                                       |
| ---------------- | -------- | ----------------------------------------------------------------- |
| `contractLength` | Yes      | Contract duration in months (e.g., 12, 24, 36)                    |
| `monthlyPrice`   | Yes      | Monthly subscription price                                        |
| `setupFee`       | No       | One-time setup fee                                                |
| `discount`       | No       | Discount object with `type` ("percentage" or "fixed") and `value` |

## Pricing Strategy

Set monthly prices based on your cost recovery goals:

```javascript theme={null}
// Example: Target 100% cost recovery in 24 months
const acquisitionCost = 1800;
const targetMonths = 24;
const marginPercent = 0.10; // 10% margin

const monthlyPrice = (acquisitionCost / targetMonths) * (1 + marginPercent);
// = 82.50/month for 24-month contract
```

<Tip>
  Use shorter contract lengths for higher monthly prices (faster cost recovery) and longer contracts for lower monthly prices (better customer value).
</Tip>

## Variant SKU Best Practices

Create predictable, searchable SKUs:

```
{PRODUCT}-{SPEC}-{CONFIG}-{GRADE}

Examples:
- MACBOOK-PRO-16-M3PRO-18GB-SILVER-A
- IPAD-PRO-12-M2-256GB-WIFI-B
- EBIKE-VANMOOF-S5-DARK-A
```

## Upsert Behavior

When you create a product with an existing `productSku`:

1. **Product fields** are updated with new values
2. **Existing variants** (matching SKU) are updated
3. **New variants** (new SKU) are added
4. **Missing variants** (not in request) remain unchanged

<Warning>
  To remove a variant, use the variant status update endpoint to set it to `inactive`. Variants are never automatically deleted.
</Warning>

## Error Handling

| Error Code         | Cause                                           | Solution                                                               |
| ------------------ | ----------------------------------------------- | ---------------------------------------------------------------------- |
| `VALIDATION_ERROR` | Missing required fields                         | Check `details` array for specific errors                              |
| `DUPLICATE_SKU`    | Variant SKU already exists on different product | Use unique SKUs per variant                                            |
| `INVALID_PRICING`  | Pricing array is invalid                        | Each tier needs `contractLength` (integer) and `monthlyPrice` (number) |

## Related Endpoints

* [List Products](/api-reference/products/list) - Browse catalog
* [Get Product](/api-reference/products/get) - View product details
* [Update Product](/api-reference/products/update) - Modify existing product
* [Import CSV](/api-reference/products/import-csv) - Bulk import products


## OpenAPI

````yaml POST /v1/products
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
    post:
      tags:
        - Products
      summary: Create a product
      description: >-
        Creates a new product with its variants. Uses upsert logic - will update
        if product SKU already exists. Products can have multiple variants
        representing different conditions/grades, each with their own pricing
        tiers for different contract lengths.
      operationId: createProduct
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
                productSku:
                  type: string
                  minLength: 1
                name:
                  type: string
                  minLength: 1
                specification:
                  type: string
                  minLength: 1
                category:
                  type: string
                  minLength: 1
                brand:
                  type: string
                  minLength: 1
                description:
                  type: string
                images:
                  type: array
                  items:
                    type: string
                    format: uri
                variants:
                  type: array
                  items:
                    type: object
                    properties:
                      variantId:
                        type: string
                      variantSku:
                        type: string
                        minLength: 1
                      variantName:
                        type: string
                        minLength: 1
                      grade:
                        type: string
                        minLength: 1
                      condition:
                        type: string
                      colorName:
                        type: string
                      images:
                        type: array
                        items:
                          type: string
                          format: uri
                      listPrice:
                        type: number
                        minimum: 0
                      acquisitionCost:
                        type: number
                        minimum: 0
                      pricing:
                        type: array
                        items:
                          type: object
                          properties:
                            contractLength:
                              type: integer
                              minimum: 1
                            monthlyPrice:
                              type: number
                              minimum: 0
                            setupFee:
                              type: number
                              minimum: 0
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
                                  minimum: 0
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
                            calculatedAt: {}
                            presetUsed:
                              type: string
                          required:
                            - contractLength
                            - monthlyPrice
                        minItems: 1
                    required:
                      - variantSku
                      - variantName
                      - grade
                      - pricing
                  minItems: 1
              required:
                - productSku
                - name
                - specification
                - category
                - brand
                - variants
            example:
              productSku: MACBOOK-PRO-16-M3
              name: MacBook Pro 16" M3 Pro
              category: Laptops
              brand: Apple
              specification:
                processor: Apple M3 Pro
                memory: 18GB
                storage: 512GB SSD
                display: 16.2-inch Liquid Retina XDR
              status: active
              variants:
                - variantSku: MACBOOK-PRO-16-M3-A
                  variantName: Grade A - Like New
                  grade: A
                  listPrice: 2499
                  acquisitionCost: 1800
                  pricing:
                    - contractLength: 12
                      monthlyPrice: 149.99
                    - contractLength: 24
                      monthlyPrice: 99.99
                    - contractLength: 36
                      monthlyPrice: 79.99
                - variantSku: MACBOOK-PRO-16-M3-B
                  variantName: Grade B - Good
                  grade: B
                  listPrice: 2199
                  acquisitionCost: 1500
                  pricing:
                    - contractLength: 12
                      monthlyPrice: 129.99
                    - contractLength: 24
                      monthlyPrice: 89.99
                    - contractLength: 36
                      monthlyPrice: 69.99
      responses:
        '201':
          description: Product created
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
                  productId:
                    type: string
                  productSku:
                    type: string
                  operation:
                    type: string
                    enum:
                      - created
                      - updated
                  variantResults:
                    type: array
                    items:
                      type: object
                      properties:
                        variantSku:
                          type: string
                        operation:
                          type: string
                          enum:
                            - create
                            - update
                      required:
                        - variantSku
                        - operation
                required:
                  - success
                  - message
                  - productId
                  - productSku
                  - operation
                  - variantResults
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