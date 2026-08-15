> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Generate Contract

> Generates a PDF contract for an order using tenant-configured templates.

## Overview

Generate a contract document for an order. Contracts are automatically populated with order details, customer information, and your tenant's terms and branding.

## Request Fields

| Field        | Required | Description                                        |
| ------------ | -------- | -------------------------------------------------- |
| `orderId`    | Yes      | Order to generate contract for                     |
| `templateId` | No       | Custom template ID (uses default if not specified) |

## Example Request

```json theme={null}
{
  "orderId": "ord_abc123"
}
```

## What Gets Generated

The contract includes:

* **Customer Information**: Name, company, contact details
* **Order Details**: Items, quantities, pricing
* **Billing Terms**: Payment schedule, amounts
* **Contract Terms**: Duration, conditions
* **Your Branding**: Logo, company info from tenant settings

## Response

```json theme={null}
{
  "success": true,
  "fileId": "file_contract_xyz789",
  "fileName": "contract-ord_abc123.pdf",
  "downloadUrl": "https://storage.example.com/...",
  "expiresAt": "2025-01-15T12:00:00Z"
}
```

## Example: Generate and Attach to Order

```javascript theme={null}
async function createOrderContract(orderId) {
  // Generate the contract
  const { fileId, downloadUrl } = await generateContract({ orderId });

  // Contract is automatically linked to the order
  console.log(`Contract ${fileId} generated for order ${orderId}`);

  return {
    contractId: fileId,
    downloadUrl
  };
}
```

## Contract Templates

Contracts use templates configured in your tenant settings:

* **Default Template**: Standard contract layout
* **Custom Templates**: Industry or use-case specific formats

Configure templates in Dashboard → Settings → Contract Templates.

## Common Use Cases

* **Order Confirmation**: Generate contract when order is confirmed
* **Customer Portal**: Let customers download their contracts
* **Compliance**: Maintain signed contract records
* **Automation**: Auto-generate contracts on order creation

## Example: Auto-Generate on Order Confirm

```javascript theme={null}
async function confirmOrderWithContract(orderId) {
  // Confirm the order
  await updateOrder(orderId, { status: 'confirmed' });

  // Generate contract
  const contract = await generateContract({ orderId });

  // Optionally email to customer
  await sendContractEmail(orderId, contract.downloadUrl);

  return {
    orderConfirmed: true,
    contractGenerated: true,
    contractId: contract.fileId
  };
}
```

## Error Handling

| Error Code           | Cause               | Solution                               |
| -------------------- | ------------------- | -------------------------------------- |
| `ORDER_NOT_FOUND`    | Invalid order ID    | Verify order exists                    |
| `TEMPLATE_NOT_FOUND` | Invalid template ID | Use valid template or omit for default |

## Related Endpoints

* [Get File](/api-reference/files/get) - Get contract metadata
* [Get File URL](/api-reference/files/url) - Get download URL
* [List Files](/api-reference/files/list) - View all order documents
* [Get Order](/api-reference/orders/get) - View order details


## OpenAPI

````yaml POST /v1/files/contracts/generate
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
  /v1/files/contracts/generate:
    post:
      tags:
        - Files
      summary: Generate a contract
      description: Generates a PDF contract for an order using tenant-configured templates.
      operationId: generateContract
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
                orderId:
                  type: string
                  minLength: 1
                contractType:
                  type: string
              required:
                - orderId
      responses:
        '201':
          description: Contract generated
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
                  orderId:
                    type: string
                  tenantId:
                    type: string
                required:
                  - success
                  - message
                  - fileId
                  - orderId
                  - tenantId
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