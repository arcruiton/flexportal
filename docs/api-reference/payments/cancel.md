> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Cancel Payment

> Cancels a pending payment. Cannot cancel already paid or processing payments.

## Overview

Cancel a pending or failed payment. Use this when a payment should not be collected—for example, when a subscription was ended early or a billing adjustment is needed.

<Warning>
  Cancelling a payment removes it from collection. This action cannot be undone. For refunds of already-paid payments, use your payment processor's refund functionality.
</Warning>

## Common Use Cases

* **Early Termination**: Subscription ended before payment due
* **Billing Adjustment**: Correcting overcharges or errors
* **Customer Goodwill**: Waiving a payment as a courtesy
* **Duplicate Payments**: Removing duplicate scheduled payments
* **Subscription Cancelled**: Associated subscription was cancelled

## Request Fields

| Field    | Required | Description             |
| -------- | -------- | ----------------------- |
| `reason` | Yes      | Reason for cancellation |

## Example Request

```json theme={null}
{
  "reason": "Subscription ended early - customer relocated"
}
```

## What Happens

When you cancel a payment:

1. **Payment status** changes to `cancelled`
2. **Cannot be collected** or marked as paid
3. **Subscription** metrics may be updated
4. **Reason** recorded for audit trail

## Which Payments Can Be Cancelled

| Current Status | Can Cancel?             |
| -------------- | ----------------------- |
| `pending`      | Yes                     |
| `processing`   | No (wait for result)    |
| `paid`         | No (use refund instead) |
| `failed`       | Yes                     |
| `cancelled`    | No (already cancelled)  |

## Example: Cancel Due to Early Return

```javascript theme={null}
async function handleEarlyReturn(subscriptionId) {
  // Get all pending payments for this subscription
  const { payments } = await listPayments({
    rentalId: subscriptionId,
    status: 'pending'
  });

  // Cancel remaining payments
  for (const payment of payments) {
    await cancelPayment(payment.paymentId, {
      reason: `Subscription ${subscriptionId} ended early`
    });
  }

  return {
    cancelledPayments: payments.length,
    savedAmount: payments.reduce((sum, p) => sum + p.amount, 0)
  };
}
```

## Example: Cancel with Customer Reason

```javascript theme={null}
async function cancelAsGoodwill(paymentId, customerName) {
  return await cancelPayment(paymentId, {
    reason: `Goodwill gesture for ${customerName} - approved by manager`
  });
}
```

## Error Handling

| Error Code           | Cause                        | Solution           |
| -------------------- | ---------------------------- | ------------------ |
| `NOT_FOUND`          | Payment doesn't exist        | Verify payment ID  |
| `ALREADY_PAID`       | Cannot cancel paid payment   | Use refund instead |
| `ALREADY_CANCELLED`  | Payment already cancelled    | No action needed   |
| `PAYMENT_PROCESSING` | Payment currently processing | Wait for result    |

## Related Endpoints

* [Get Payment](/api-reference/payments/get) - Check payment status
* [List Payments](/api-reference/payments/list) - Find payments to cancel
* [Mark Paid](/api-reference/payments/mark-paid) - Alternative: mark as paid
* [Early Return](/api-reference/subscriptions/early-return) - End subscription early


## OpenAPI

````yaml POST /v1/payments/{paymentId}/cancel
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
  /v1/payments/{paymentId}/cancel:
    post:
      tags:
        - Payments
      summary: Cancel a payment
      description: >-
        Cancels a pending payment. Cannot cancel already paid or processing
        payments.
      operationId: cancelPayment
      parameters:
        - schema:
            type: string
            description: The payment ID
          required: true
          name: paymentId
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
                  minLength: 1
              required:
                - reason
      responses:
        '200':
          description: Payment cancelled
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
                  payment:
                    type: object
                    properties:
                      paymentId:
                        type: string
                        minLength: 1
                      tenantId:
                        type: string
                        minLength: 1
                      customerId:
                        type: string
                        minLength: 1
                      subtotal:
                        type: number
                        minimum: 0
                      taxAmount:
                        type: number
                        minimum: 0
                        default: 0
                      taxRate:
                        type: number
                        minimum: 0
                        maximum: 100
                        default: 0
                      total:
                        type: number
                        minimum: 0
                      currency:
                        type: string
                        minLength: 3
                        maxLength: 3
                      amount:
                        type: number
                        minimum: 0
                      paymentType:
                        type: string
                        enum:
                          - individual
                          - consolidated
                      rentalId:
                        type: string
                      billingGroupId:
                        type: string
                      billingPeriod:
                        type: string
                        pattern: ^\d{4}-\d{2}$
                      status:
                        type: string
                        enum:
                          - pending
                          - processing
                          - paid
                          - failed
                          - cancelled
                      provider:
                        type: string
                        enum:
                          - stripe
                          - adyen
                          - paypal
                          - manual
                      transactionId:
                        type: string
                      providerResponse:
                        type: object
                        additionalProperties: {}
                      manuallyMarked:
                        type: boolean
                        default: false
                      paymentReference:
                        type: string
                      markedBy:
                        type: string
                      captureAttempts:
                        type: integer
                        minimum: 0
                        default: 0
                      lastCaptureError:
                        type: object
                        properties:
                          code:
                            type: string
                          message:
                            type: string
                          declineCode:
                            type: string
                        required:
                          - code
                          - message
                      lineItems:
                        type: array
                        items:
                          type: object
                          properties:
                            rentalId:
                              type: string
                              minLength: 1
                            description:
                              type: string
                            amount:
                              type: number
                              minimum: 0
                            taxAmount:
                              type: number
                              minimum: 0
                              default: 0
                          required:
                            - rentalId
                            - description
                            - amount
                      lateFeeApplied:
                        type: boolean
                        default: false
                      lateFeeAmount:
                        type: number
                        minimum: 0
                      originalAmount:
                        type: number
                        minimum: 0
                      idempotencyKey:
                        type: string
                        minLength: 1
                      notes:
                        type: string
                      dueDate:
                        type: string
                      paidAt:
                        type:
                          - string
                          - 'null'
                      lastCaptureAttempt:
                        type:
                          - string
                          - 'null'
                      nextRetryAt:
                        type:
                          - string
                          - 'null'
                      createdAt:
                        type: string
                      updatedAt:
                        type: string
                    required:
                      - paymentId
                      - tenantId
                      - customerId
                      - subtotal
                      - total
                      - currency
                      - paymentType
                      - billingPeriod
                      - status
                      - idempotencyKey
                      - dueDate
                      - createdAt
                      - updatedAt
                required:
                  - success
                  - message
                  - payment
        '400':
          description: Bad request (payment not cancellable)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Payment not found
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