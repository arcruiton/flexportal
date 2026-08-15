> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get File

> Retrieves metadata for a specific file. Does not return the file content.

## Overview

Retrieve metadata for a single file. Use this to get file details before downloading or to verify file properties.

## Response Fields

| Field        | Description                                           |
| ------------ | ----------------------------------------------------- |
| `fileId`     | Unique file identifier                                |
| `fileName`   | Original file name                                    |
| `fileType`   | Type: `contract`, `invoice`, `document`, `attachment` |
| `mimeType`   | MIME type                                             |
| `size`       | File size in bytes                                    |
| `orderId`    | Associated order ID                                   |
| `customerId` | Associated customer ID                                |
| `createdAt`  | When file was created                                 |
| `updatedAt`  | Last modification                                     |

## Common Use Cases

* **Pre-Download Check**: Verify file exists and get metadata
* **File Information**: Display file details in UI
* **Validation**: Check file type and size before processing

## Example: Display File Info

```javascript theme={null}
async function getFileInfo(fileId) {
  const file = await getFile(fileId);

  return {
    name: file.fileName,
    type: file.fileType,
    size: `${(file.size / 1024).toFixed(1)} KB`,
    created: new Date(file.createdAt).toLocaleDateString()
  };
}
```

## Related Endpoints

* [List Files](/api-reference/files/list) - Browse all files
* [Get File URL](/api-reference/files/url) - Get download URL
* [Delete File](/api-reference/files/delete) - Remove file


## OpenAPI

````yaml GET /v1/files/{fileId}
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
  /v1/files/{fileId}:
    get:
      tags:
        - Files
      summary: Get file metadata
      description: >-
        Retrieves metadata for a specific file. Does not return the file
        content.
      operationId: getFile
      parameters:
        - schema:
            type: string
            description: The file ID
          required: true
          name: fileId
          in: path
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: File metadata
          content:
            application/json:
              schema:
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
        '404':
          description: File not found
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