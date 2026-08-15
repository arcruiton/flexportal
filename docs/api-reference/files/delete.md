> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Delete File

> Deletes a file record and optionally removes from storage.

## Overview

Delete a file from storage. This permanently removes the file—it cannot be recovered.

<Warning>
  File deletion is permanent. Ensure you have backups if the file may be needed later.
</Warning>

## Common Use Cases

* **Cleanup**: Remove outdated or superseded documents
* **Corrections**: Delete incorrectly uploaded files
* **Compliance**: Remove files per data retention policies
* **Storage Management**: Free up storage space

## What Gets Deleted

* **File content** is permanently removed from storage
* **File metadata** is removed from the database
* **References** in orders/subscriptions are cleared

## Example: Delete Obsolete Document

```javascript theme={null}
async function deleteObsoleteFile(fileId) {
  // Verify file exists first
  const file = await getFile(fileId);
  console.log(`Deleting: ${file.fileName}`);

  // Delete the file
  await deleteFile(fileId);

  return { deleted: true, fileName: file.fileName };
}
```

## Example: Cleanup Old Files

```javascript theme={null}
async function cleanupOldFiles(orderId, keepTypes) {
  const { files } = await listFiles({ orderId });

  const toDelete = files.filter(f => !keepTypes.includes(f.fileType));

  for (const file of toDelete) {
    await deleteFile(file.fileId);
  }

  return {
    deleted: toDelete.length,
    kept: files.length - toDelete.length
  };
}

// Usage: Keep only contracts, delete other files
await cleanupOldFiles('ord_abc123', ['contract']);
```

## Error Handling

| Error Code      | Cause              | Solution                 |
| --------------- | ------------------ | ------------------------ |
| `NOT_FOUND`     | File doesn't exist | Verify file ID           |
| `DELETE_FAILED` | Storage error      | Retry or contact support |

## Related Endpoints

* [Get File](/api-reference/files/get) - Verify file before deletion
* [List Files](/api-reference/files/list) - Find files to delete


## OpenAPI

````yaml DELETE /v1/files/{fileId}
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
    delete:
      tags:
        - Files
      summary: Delete a file
      description: Deletes a file record and optionally removes from storage.
      operationId: deleteFile
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
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                deleteFromStorage:
                  type: boolean
                  description: 'Also delete from storage (default: true)'
      responses:
        '200':
          description: File deleted
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
                  fileId:
                    type: string
                required:
                  - success
                  - message
                  - fileId
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