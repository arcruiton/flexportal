> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get File URL

> Generates a signed URL for viewing or downloading a file. URLs expire after the specified time.

## Overview

Generate a signed URL for uploading or downloading files. Signed URLs provide secure, time-limited access to file storage without exposing credentials.

## URL Types

| Action     | Use Case                          |
| ---------- | --------------------------------- |
| `download` | Get URL to download existing file |
| `upload`   | Get URL to upload new file        |

## Request Fields

| Field         | Required     | Description            |
| ------------- | ------------ | ---------------------- |
| `action`      | Yes          | `download` or `upload` |
| `fileId`      | For download | ID of file to download |
| `fileName`    | For upload   | Name of file to upload |
| `contentType` | For upload   | MIME type of file      |

## Download Example

Get a URL to download an existing file:

```json theme={null}
{
  "action": "download",
  "fileId": "file_abc123"
}
```

Response:

```json theme={null}
{
  "url": "https://storage.example.com/files/abc123?signature=...",
  "expiresAt": "2025-01-15T11:30:00Z"
}
```

## Upload Example

Get a URL to upload a new file:

```json theme={null}
{
  "action": "upload",
  "fileName": "contract-order-123.pdf",
  "contentType": "application/pdf"
}
```

Response:

```json theme={null}
{
  "url": "https://storage.example.com/upload?signature=...",
  "fileId": "file_xyz789",
  "expiresAt": "2025-01-15T11:30:00Z"
}
```

## URL Expiration

Signed URLs expire after a short period (typically 15-60 minutes). Use them promptly after generation.

## Example: Download File

```javascript theme={null}
async function downloadFile(fileId) {
  // Get signed download URL
  const { url } = await getFileUrl({
    action: 'download',
    fileId
  });

  // Download using the signed URL
  const response = await fetch(url);
  return await response.blob();
}
```

## Example: Upload File

```javascript theme={null}
async function uploadFile(file) {
  // Get signed upload URL
  const { url, fileId } = await getFileUrl({
    action: 'upload',
    fileName: file.name,
    contentType: file.type
  });

  // Upload to signed URL
  await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type
    }
  });

  return fileId;
}
```

## Related Endpoints

* [Get File](/api-reference/files/get) - Get file metadata
* [List Files](/api-reference/files/list) - Browse files
* [Delete File](/api-reference/files/delete) - Remove uploaded file


## OpenAPI

````yaml POST /v1/files/url
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
  /v1/files/url:
    post:
      tags:
        - Files
      summary: Get secure file URL
      description: >-
        Generates a signed URL for viewing or downloading a file. URLs expire
        after the specified time.
      operationId: getFileUrl
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
                fileId:
                  type: string
                  minLength: 1
                action:
                  type: string
                  enum:
                    - view
                    - download
                  default: view
                expiresInMinutes:
                  type: number
                  minimum: 1
                  maximum: 1440
                  default: 60
              required:
                - fileId
      responses:
        '200':
          description: Signed URL generated
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    enum:
                      - true
                  url:
                    type: string
                    format: uri
                  filename:
                    type: string
                    minLength: 1
                  contentType:
                    type: string
                    minLength: 1
                  fileSize:
                    type: number
                    minimum: 0
                  expiresAt:
                    type: number
                    minimum: 0
                required:
                  - success
                  - url
                  - filename
                  - contentType
                  - fileSize
                  - expiresAt
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