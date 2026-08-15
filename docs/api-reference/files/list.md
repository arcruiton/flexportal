> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# List Files

> Returns a list of files with optional filtering by order or type.

## Overview

Retrieve a list of files associated with orders, subscriptions, or your tenant. Files include contracts, invoices, uploaded documents, and other attachments.

## File Types

| Type         | Description                       |
| ------------ | --------------------------------- |
| `contract`   | Subscription contract documents   |
| `invoice`    | Billing invoices                  |
| `document`   | General uploaded documents        |
| `attachment` | Order or subscription attachments |

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Order Documents" icon="file-contract">
    Retrieve contracts and documents for an order
  </Card>

  <Card title="Customer Portal" icon="folder-open">
    Display documents for customer self-service
  </Card>

  <Card title="Invoice History" icon="file-invoice">
    List invoices for a customer or subscription
  </Card>

  <Card title="Document Management" icon="files">
    Manage uploaded documents and attachments
  </Card>
</CardGroup>

## Filtering Files

```bash theme={null}
# Get files for an order
GET /v1/files?orderId=ord_abc123

# Get files by type
GET /v1/files?type=contract

# Get invoices for a customer
GET /v1/files?customerId=cust_abc123&type=invoice
```

## Response Fields

| Field        | Description                                           |
| ------------ | ----------------------------------------------------- |
| `fileId`     | Unique file identifier                                |
| `fileName`   | Original file name                                    |
| `fileType`   | Type: `contract`, `invoice`, `document`, `attachment` |
| `mimeType`   | MIME type (e.g., `application/pdf`)                   |
| `size`       | File size in bytes                                    |
| `orderId`    | Associated order (if applicable)                      |
| `customerId` | Associated customer                                   |
| `createdAt`  | Upload timestamp                                      |

## Example: Get Order Documents

```javascript theme={null}
async function getOrderDocuments(orderId) {
  const { files } = await listFiles({ orderId });

  return files.map(file => ({
    name: file.fileName,
    type: file.fileType,
    size: `${(file.size / 1024).toFixed(1)} KB`
  }));
}
```

## Related Endpoints

* [Get File](/api-reference/files/get) - Get file metadata
* [Get File URL](/api-reference/files/url) - Get download URL
* [Generate Contract](/api-reference/files/generate-contract) - Create contract document


## OpenAPI

````yaml GET /v1/files
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
  /v1/files:
    get:
      tags:
        - Files
      summary: List files
      description: Returns a list of files with optional filtering by order or type.
      operationId: listFiles
      parameters:
        - schema:
            type: string
            description: Filter by order ID
          required: false
          name: orderId
          in: query
        - schema:
            type: string
            description: Filter by file type
          required: false
          name: type
          in: query
        - schema:
            type: string
            description: 'Items per page (default: 50)'
          required: false
          name: limit
          in: query
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: List of files
          content:
            application/json:
              schema:
                type: object
                properties:
                  files:
                    type: array
                    items:
                      type: object
                      properties:
                        fileId:
                          type: string
                        tenantId:
                          type: string
                        orderId:
                          type: string
                        type:
                          type: string
                        category:
                          type: string
                          enum:
                            - generated
                            - uploaded
                        filename:
                          type: string
                        originalFilename:
                          type: string
                        contentType:
                          type: string
                        fileSize:
                          type: number
                        storagePath:
                          type: string
                        uploadedBy:
                          type: string
                        createdAt:
                          type: string
                        updatedAt:
                          type: string
                        metadata:
                          type: object
                          additionalProperties: {}
                      required:
                        - fileId
                        - tenantId
                        - orderId
                        - type
                        - category
                        - filename
                        - contentType
                        - fileSize
                        - storagePath
                        - uploadedBy
                        - createdAt
                        - updatedAt
                  count:
                    type: number
                  limit:
                    type: number
                  offset:
                    type: number
                  filters:
                    type: object
                    properties:
                      orderId:
                        type: string
                      type:
                        type: string
                required:
                  - files
                  - count
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      description: API key obtained from FlexPortal dashboard

````