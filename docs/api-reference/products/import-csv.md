> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Import Products CSV

> Bulk import products and variants from a CSV file. Supports up to ~500 products per request.

## Overview

Bulk import products and variants from a CSV file. This is the fastest way to populate your catalog when onboarding or syncing from external systems.

<Info>
  This endpoint uses **upsert behavior**: existing products (matched by Product SKU) are updated, and new products are created. Variants are matched by Variant SKU.
</Info>

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Initial Catalog Setup" icon="upload">
    Quickly populate your catalog when first setting up FlexPortal
  </Card>

  <Card title="Supplier Updates" icon="truck">
    Import updated pricing or new products from supplier catalogs
  </Card>

  <Card title="Bulk Price Changes" icon="tags">
    Update pricing across many products at once
  </Card>

  <Card title="Inventory Sync" icon="arrows-rotate">
    Periodic sync from inventory management systems
  </Card>
</CardGroup>

## CSV Format

The CSV file must include a header row with these columns:

| Column             | Required | Description                            |
| ------------------ | -------- | -------------------------------------- |
| `Product Name`     | Yes      | Display name (e.g., "MacBook Pro 16"") |
| `Product SKU`      | Yes      | Parent product SKU                     |
| `Category`         | Yes      | Product category                       |
| `Brand`            | Yes      | Brand/manufacturer                     |
| `Specification`    | Yes      | Technical specs (e.g., "M3 Pro, 18GB") |
| `Grade`            | No       | Condition: A, B, C, D, E (default: A)  |
| `Color`            | No       | Color option                           |
| `Variant SKU`      | Yes      | Unique SKU for this variant            |
| `List Price`       | Yes      | MSRP/retail price                      |
| `Acquisition Cost` | Yes      | Your cost to acquire                   |
| `6mo_Price`        | No       | Monthly price for 6-month contract     |
| `12mo_Price`       | No       | Monthly price for 12-month contract    |
| `24mo_Price`       | No       | Monthly price for 24-month contract    |
| `36mo_Price`       | No       | Monthly price for 36-month contract    |

## Example CSV

```csv theme={null}
Product Name,Product SKU,Category,Brand,Specification,Grade,Color,Variant SKU,List Price,Acquisition Cost,6mo_Price,12mo_Price,24mo_Price,36mo_Price
MacBook Pro 16",MACBOOK-PRO-16,Laptops,Apple,M3 Pro 18GB 512GB,A,Silver,MBP16-M3PRO-18-512-SIL-A,2499,1800,199,159,129,109
MacBook Pro 16",MACBOOK-PRO-16,Laptops,Apple,M3 Pro 18GB 512GB,A,Space Black,MBP16-M3PRO-18-512-BLK-A,2499,1800,199,159,129,109
MacBook Pro 16",MACBOOK-PRO-16,Laptops,Apple,M3 Max 64GB 1TB,A,Space Black,MBP16-M3MAX-64-1TB-BLK-A,3999,2800,319,249,199,169
iPad Pro 12.9",IPAD-PRO-12,Tablets,Apple,M2 256GB WiFi,A,Space Gray,IPAD12-M2-256-WIFI-GRY-A,1099,750,99,79,59,49
ThinkPad X1 Carbon,THINKPAD-X1,Laptops,Lenovo,i7 16GB 512GB,A,Black,X1C-I7-16-512-BLK-A,1899,1200,159,129,99,79
```

## Making the Request

Send the CSV file in the request body with `Content-Type: text/csv`:

```bash theme={null}
curl -X POST "https://api-eu.flexportal.io/v1/products/csv" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Tenant-ID: YOUR_TENANT_ID" \
  -H "Content-Type: text/csv" \
  --data-binary @products.csv
```

Or with JavaScript:

```javascript theme={null}
const csvContent = await fs.readFile('products.csv', 'utf-8');

const response = await fetch('https://api-eu.flexportal.io/v1/products/csv', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Tenant-ID': 'YOUR_TENANT_ID',
    'Content-Type': 'text/csv'
  },
  body: csvContent
});

const result = await response.json();
console.log(`Imported: ${result.created} created, ${result.updated} updated`);
```

## Response

```json theme={null}
{
  "success": true,
  "message": "Import completed",
  "summary": {
    "totalRows": 50,
    "productsCreated": 12,
    "productsUpdated": 3,
    "variantsCreated": 45,
    "variantsUpdated": 5,
    "errors": []
  }
}
```

## Error Handling

If some rows fail validation, the import continues and returns errors:

```json theme={null}
{
  "success": true,
  "message": "Import completed with errors",
  "summary": {
    "totalRows": 50,
    "productsCreated": 10,
    "variantsCreated": 40,
    "errors": [
      {
        "row": 15,
        "sku": "INVALID-SKU",
        "error": "Invalid List Price: must be a positive number"
      },
      {
        "row": 23,
        "sku": "DUPLICATE-SKU",
        "error": "Variant SKU already exists on different product"
      }
    ]
  }
}
```

## Best Practices

<CardGroup cols={2}>
  <Card title="Validate First" icon="check">
    Test with a small sample before importing large catalogs
  </Card>

  <Card title="Consistent SKUs" icon="fingerprint">
    Use a consistent SKU naming convention for easy management
  </Card>

  <Card title="Include All Pricing" icon="dollar-sign">
    Provide all contract length prices you want to offer
  </Card>

  <Card title="UTF-8 Encoding" icon="file-code">
    Save CSV files with UTF-8 encoding for special characters
  </Card>
</CardGroup>

## Limits

| Limit              | Value      |
| ------------------ | ---------- |
| Maximum file size  | 10 MB      |
| Maximum rows       | 10,000     |
| Processing timeout | 60 seconds |

<Warning>
  For very large catalogs (10,000+ products), split into multiple files and import in batches.
</Warning>

## Related Endpoints

* [List Products](/api-reference/products/list) - Verify imported products
* [Create Product](/api-reference/products/create) - Add individual products
* [List Variants](/api-reference/products/variants) - Query imported variants


## OpenAPI

````yaml POST /v1/products/csv
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
  /v1/products/csv:
    post:
      tags:
        - Products
      summary: Import products from CSV
      description: >-
        Bulk import products and variants from a CSV file. Supports up to ~500
        products per request.
      operationId: importProductsCSV
      parameters:
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                csvFile:
                  type: string
                  format: binary
                  description: CSV file with product data
              required:
                - csvFile
      responses:
        '201':
          description: Import completed
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
                  created:
                    type: number
                    description: Products created
                  updated:
                    type: number
                    description: Products updated
                  errors:
                    type: array
                    items:
                      type: object
                      properties:
                        row:
                          type: number
                        error:
                          type: string
                      required:
                        - row
                        - error
                required:
                  - success
                  - message
                  - created
                  - updated
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