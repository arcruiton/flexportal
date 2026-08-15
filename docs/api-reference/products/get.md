> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Product

> Retrieves a specific product by ID, including its variants.

## Overview

Retrieve a single product by ID, including all its variants. Use this endpoint when you need complete product details including pricing for all configurations.

## Common Use Cases

* **Product Detail Page**: Display full product information with all available variants
* **Variant Selection**: Show customers all available configurations and their pricing
* **Order Validation**: Verify a variant exists and is active before creating an order
* **Pricing Display**: Show subscription pricing for different contract lengths

## Understanding Variants

Each variant represents a specific product configuration:

```json theme={null}
{
  "variantId": "var_abc123",
  "sku": "MACBOOK-PRO-16-M3-64GB-BLACK",
  "specification": "M3 Max, 64GB RAM, 1TB SSD",
  "grade": "A",
  "color": "Space Black",
  "status": "active",
  "listPrice": 3999.00,
  "acquisitionCost": 2800.00,
  "pricing": {
    "6": 249.00,
    "12": 189.00,
    "24": 149.00,
    "36": 129.00
  }
}
```

## Variant Fields Explained

| Field             | Description                                      |
| ----------------- | ------------------------------------------------ |
| `sku`             | Unique variant identifier used in orders         |
| `specification`   | Technical specs (e.g., "M3 Max, 64GB")           |
| `grade`           | Condition grade: A (like new) to E (refurbished) |
| `color`           | Color option                                     |
| `status`          | `active` or `inactive`                           |
| `listPrice`       | MSRP/retail price                                |
| `acquisitionCost` | Your cost to acquire this variant                |
| `pricing`         | Monthly prices by contract length (months)       |

## Pricing by Contract Length

The `pricing` object maps contract lengths (in months) to monthly subscription prices:

```json theme={null}
{
  "pricing": {
    "6": 249.00,   // 6-month contract: €249/month
    "12": 189.00,  // 12-month contract: €189/month
    "24": 149.00,  // 24-month contract: €149/month
    "36": 129.00   // 36-month contract: €129/month
  }
}
```

<Tip>
  Longer contracts typically have lower monthly prices. Configure your pricing tiers based on your cost recovery targets.
</Tip>

## Grade Classification

Products are classified by condition:

| Grade | Description                    | Typical Use                    |
| ----- | ------------------------------ | ------------------------------ |
| A     | Like new, minimal wear         | Premium subscriptions          |
| B     | Light wear, fully functional   | Standard subscriptions         |
| C     | Visible wear, fully functional | Budget subscriptions           |
| D     | Significant wear, functional   | Short-term/value subscriptions |
| E     | Refurbished/repaired           | Budget/secondary market        |

## Example: Building a Variant Selector

```javascript theme={null}
const product = await getProduct('prod_abc123');

// Group variants by specification
const variantsBySpec = {};
for (const variant of product.variants) {
  if (variant.status === 'active') {
    const spec = variant.specification;
    if (!variantsBySpec[spec]) {
      variantsBySpec[spec] = [];
    }
    variantsBySpec[spec].push(variant);
  }
}

// Display options to user
for (const [spec, variants] of Object.entries(variantsBySpec)) {
  console.log(`\n${spec}:`);
  for (const v of variants) {
    console.log(`  - ${v.color} (${v.grade}): €${v.pricing['24']}/mo for 24mo`);
  }
}
```

## Related Endpoints

* [List Products](/api-reference/products/list) - Browse all products
* [List Variants](/api-reference/products/variants) - Query variants across products
* [Update Product](/api-reference/products/update) - Modify product details
* [Create Order](/api-reference/orders/create) - Create orders using variant SKUs


## OpenAPI

````yaml GET /v1/products/{productId}
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
  /v1/products/{productId}:
    get:
      tags:
        - Products
      summary: Get a product
      description: Retrieves a specific product by ID, including its variants.
      operationId: getProduct
      parameters:
        - schema:
            type: string
            description: The product ID
          required: true
          name: productId
          in: path
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: Product details
          content:
            application/json:
              schema:
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
        '404':
          description: Product not found
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