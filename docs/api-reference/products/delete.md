> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Delete Product

> Soft deletes a product by setting status to discontinued. Also deactivates all associated variants.

## Overview

Discontinue a product by marking it as inactive. This is a **soft delete**—the product is hidden from active catalog queries but preserved for historical records and existing subscriptions.

<Warning>
  Products cannot be permanently deleted if they have associated orders or subscriptions. This ensures data integrity and accurate historical reporting.
</Warning>

## What Happens When You Delete a Product

1. **Product status** changes to `discontinued`
2. **All variants** are marked as `inactive`
3. **New orders** cannot use this product's SKUs
4. **Existing subscriptions** continue unaffected
5. **Historical data** is preserved for reporting

## Common Use Cases

* **End of Life**: Product is no longer available from suppliers
* **Catalog Cleanup**: Remove products that are no longer offered
* **Replacement**: Old product replaced by new model
* **Temporary Removal**: Pause product while resolving supply issues

## Before Deleting

Check for active usage:

```javascript theme={null}
// Get product details to check for active orders
const product = await getProduct('prod_abc123');

// Check for pending orders using this product's variants
const pendingOrders = await listOrders({
  status: 'pending',
  // Filter by product variants would need to be done client-side
});

// Check for active subscriptions
const activeSubscriptions = await listSubscriptions({
  status: 'active',
  sku: product.variants[0].sku
});

if (activeSubscriptions.count > 0) {
  console.log('Warning: Product has active subscriptions');
}
```

## Reactivating a Discontinued Product

To bring back a discontinued product, use the [Update Product](/api-reference/products/update) endpoint:

```json theme={null}
PUT /v1/products/{productId}
{
  "status": "active"
}
```

You'll also need to reactivate individual variants as needed.

## Alternative: Deactivate Specific Variants

If you only want to remove certain variants (not the whole product), update individual variant status instead:

```json theme={null}
PATCH /v1/products/variants/{variantId}/status
{
  "status": "inactive"
}
```

This keeps the product active while hiding specific configurations.

## Error Handling

| Error Code                  | Cause                             | Solution                        |
| --------------------------- | --------------------------------- | ------------------------------- |
| `NOT_FOUND`                 | Product doesn't exist             | Verify product ID               |
| `PRODUCT_HAS_ACTIVE_ORDERS` | Cannot delete with pending orders | Complete or cancel orders first |

## Related Endpoints

* [Get Product](/api-reference/products/get) - Check product details before deletion
* [Update Product](/api-reference/products/update) - Reactivate or modify product
* [List Products](/api-reference/products/list) - View active catalog


## OpenAPI

````yaml DELETE /v1/products/{productId}
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
    delete:
      tags:
        - Products
      summary: Delete a product
      description: >-
        Soft deletes a product by setting status to discontinued. Also
        deactivates all associated variants.
      operationId: deleteProduct
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
          description: Product deleted
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
                required:
                  - success
                  - message
                  - productId
                  - productSku
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