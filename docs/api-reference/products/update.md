> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Update Product

> Updates an existing product and its variants.

## Overview

Update an existing product's details and variants. Use this endpoint to modify product information, update pricing, add new variants, or change variant status.

## Common Use Cases

* **Price Updates**: Adjust subscription pricing based on market conditions
* **Add Variants**: Add new configurations (colors, specs, grades)
* **Product Refresh**: Update descriptions, images, or categories
* **Discontinue Variants**: Mark old variants as inactive
* **Grade Adjustments**: Reclassify product condition after inspection

## Partial Updates

This endpoint supports partial updates. You only need to include fields you want to change:

```json theme={null}
{
  "name": "MacBook Pro 16\" (2024)",
  "description": "Updated description with new features"
}
```

## Updating Variants

To update variants, include the `variants` array with the variants you want to modify or add:

```json theme={null}
{
  "variants": [
    {
      "sku": "MACBOOK-PRO-16-M3-18GB-SILVER",
      "pricing": {
        "12": 149.00,
        "24": 119.00,
        "36": 99.00
      }
    }
  ]
}
```

### Variant Update Behavior

| Scenario         | Behavior                           |
| ---------------- | ---------------------------------- |
| **Existing SKU** | Variant is updated with new values |
| **New SKU**      | New variant is created             |
| **Missing SKU**  | Variant remains unchanged          |

<Warning>
  Variants are matched by `sku`. If you include a variant with a new SKU, it will be created. To modify an existing variant, you must use its exact current SKU.
</Warning>

## Updating Pricing

Update pricing for specific contract lengths:

```json theme={null}
{
  "variants": [
    {
      "sku": "MACBOOK-PRO-16-M3-18GB-SILVER",
      "pricing": {
        "12": 149.00,
        "24": 119.00
      }
    }
  ]
}
```

<Info>
  Pricing changes only affect new orders. Existing subscriptions retain their original pricing.
</Info>

## Updating Acquisition Cost

When asset costs change (e.g., new supplier pricing):

```json theme={null}
{
  "variants": [
    {
      "sku": "MACBOOK-PRO-16-M3-18GB-SILVER",
      "acquisitionCost": 1650.00
    }
  ]
}
```

This affects cost recovery calculations for new subscriptions.

## Discontinuing a Product

To discontinue a product (hide from catalog but preserve history):

```json theme={null}
{
  "status": "discontinued"
}
```

<Tip>
  Discontinued products cannot be used in new orders but remain visible for existing subscriptions and historical reporting.
</Tip>

## Example: Adding New Color Variant

```javascript theme={null}
// Add Space Black variant to existing MacBook Pro
await updateProduct('prod_abc123', {
  variants: [
    {
      sku: 'MACBOOK-PRO-16-M3-18GB-BLACK',
      specification: 'M3 Pro, 18GB RAM, 512GB SSD',
      grade: 'A',
      color: 'Space Black',
      listPrice: 2499.00,
      acquisitionCost: 1800.00,
      pricing: {
        '12': 159.00,
        '24': 129.00,
        '36': 109.00
      }
    }
  ]
});
```

## Example: Bulk Price Reduction

```javascript theme={null}
// Reduce prices on older stock
await updateProduct('prod_abc123', {
  variants: [
    {
      sku: 'MACBOOK-PRO-16-M3-18GB-SILVER',
      grade: 'B',  // Reclassify as Grade B
      pricing: {
        '12': 139.00,
        '24': 109.00,
        '36': 89.00
      }
    }
  ]
});
```

## Related Endpoints

* [Get Product](/api-reference/products/get) - View current product details
* [Delete Product](/api-reference/products/delete) - Discontinue a product
* [List Variants](/api-reference/products/variants) - View all variants


## OpenAPI

````yaml PUT /v1/products/{productId}
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
    put:
      tags:
        - Products
      summary: Update a product
      description: Updates an existing product and its variants.
      operationId: updateProduct
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
      responses:
        '200':
          description: Product updated
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