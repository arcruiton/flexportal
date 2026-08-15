> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Cancel Order

> Cancels a pending order. Cannot cancel orders that have fulfilled subscriptions.

## Overview

Cancel a pending order before it's been fulfilled. Use this when a customer changes their mind, the order was created in error, or the items are no longer available.

<Warning>
  You cannot cancel orders that have active subscriptions. If subscriptions have already been created from this order, you must cancel the subscriptions individually.
</Warning>

## When to Use Cancellation

| Scenario                        | Use This                     |
| ------------------------------- | ---------------------------- |
| Customer changed their mind     | **Cancel Order**             |
| Order created in error          | **Cancel Order**             |
| Items no longer available       | **Cancel Order**             |
| Order already has subscriptions | Cancel subscriptions instead |

## Request Fields

| Field    | Required | Description                              |
| -------- | -------- | ---------------------------------------- |
| `reason` | No       | Reason for cancellation (max 1000 chars) |

## Example Request

```json theme={null}
{
  "reason": "Customer requested cancellation - changed delivery address"
}
```

## Response Fields

| Field     | Description              |
| --------- | ------------------------ |
| `success` | Always `true` on success |
| `message` | Confirmation message     |
| `orderId` | The cancelled order ID   |

## What Happens

When you cancel an order:

1. **Order status** changes to `cancelled`
2. **Order items** are released (no longer reserved)
3. **Cancellation** logged with reason and timestamp
4. **No subscriptions** can be created from this order

## Example: Cancel with Reason

```javascript theme={null}
async function cancelOrder(orderId, reason) {
  const result = await cancelOrder(orderId, { reason });

  return {
    cancelled: result.success,
    orderId: result.orderId
  };
}
```

## Example: Check Before Cancelling

```javascript theme={null}
async function safeCancelOrder(orderId, reason) {
  const order = await getOrder(orderId);

  // Check if order has any fulfilled subscriptions
  if (order.rentalProgress.rentedDevices > 0) {
    throw new Error('Cannot cancel order with active subscriptions');
  }

  return await cancelOrder(orderId, { reason });
}
```

## Error Handling

| Error Code              | Cause                          | Solution                   |
| ----------------------- | ------------------------------ | -------------------------- |
| `NOT_FOUND`             | Order doesn't exist            | Verify order ID            |
| `ORDER_NOT_CANCELLABLE` | Order has active subscriptions | Cancel subscriptions first |
| `ALREADY_CANCELLED`     | Order already cancelled        | No action needed           |

## Related Endpoints

* [Get Order](/api-reference/orders/get) - Check order status before cancelling
* [List Orders](/api-reference/orders/list) - Find orders to cancel
* [Cancel Subscription](/api-reference/subscriptions/cancel) - Cancel individual subscriptions


## OpenAPI

````yaml POST /v1/orders/{orderId}/cancel
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
  /v1/orders/{orderId}/cancel:
    post:
      tags:
        - Orders
      summary: Cancel an order
      description: >-
        Cancels a pending order. Cannot cancel orders that have fulfilled
        subscriptions.
      operationId: cancelOrder
      parameters:
        - schema:
            type: string
            description: The order ID
          required: true
          name: orderId
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
                reason:
                  type: string
                  maxLength: 1000
      responses:
        '200':
          description: Order cancelled
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
                  orderId:
                    type: string
                required:
                  - success
                  - message
                  - orderId
        '400':
          description: Bad request (order not cancellable)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Order not found
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