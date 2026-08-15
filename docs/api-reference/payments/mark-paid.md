> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Mark Payment Paid

> Manually marks a payment as paid. Use for offline payments (check, wire transfer, cash).

## Overview

Manually mark a payment as paid. Use this when payment was collected outside of automated billing (e.g., bank transfer, check, cash) or to reconcile payments manually.

<Info>
  This endpoint is for manual reconciliation. Automated payments through integrated payment processors are marked paid automatically.
</Info>

## Common Use Cases

* **Bank Transfers**: Customer paid via wire transfer
* **Checks**: Payment received by check
* **Cash**: In-person cash payment
* **External Systems**: Payment collected through another system
* **Reconciliation**: Fix discrepancies between systems

## Request Fields

| Field       | Required | Description                                 |
| ----------- | -------- | ------------------------------------------- |
| `paidAt`    | No       | When payment was received (default: now)    |
| `notes`     | No       | Notes about the payment                     |
| `reference` | No       | External reference (bank ref, check number) |

## Example Request

```json theme={null}
{
  "paidAt": "2025-01-15T10:30:00Z",
  "reference": "WIRE-2025-001234",
  "notes": "Received via bank transfer"
}
```

## What Happens

When you mark a payment as paid:

1. **Payment status** changes to `paid`
2. **paidAt** timestamp recorded
3. **Subscription** cost recovery metrics updated
4. **Customer** lifetime value updated

## Example: Process Bank Transfer

```javascript theme={null}
async function recordBankTransfer(paymentId, bankReference, transferDate) {
  return await markPaymentPaid(paymentId, {
    paidAt: transferDate,
    reference: bankReference,
    notes: 'Manual reconciliation - bank transfer'
  });
}

// Usage
await recordBankTransfer('pay_abc123', 'TRF-2025-001234', '2025-01-15T10:30:00Z');
```

## Example: Bulk Reconciliation

```javascript theme={null}
async function reconcilePayments(reconciliationData) {
  const results = { success: 0, errors: [] };

  for (const item of reconciliationData) {
    try {
      await markPaymentPaid(item.paymentId, {
        paidAt: item.paidDate,
        reference: item.bankReference
      });
      results.success++;
    } catch (error) {
      results.errors.push({
        paymentId: item.paymentId,
        error: error.message
      });
    }
  }

  return results;
}
```

## Error Handling

| Error Code          | Cause                                 | Solution          |
| ------------------- | ------------------------------------- | ----------------- |
| `NOT_FOUND`         | Payment doesn't exist                 | Verify payment ID |
| `ALREADY_PAID`      | Payment already marked as paid        | No action needed  |
| `PAYMENT_CANCELLED` | Cannot mark cancelled payment as paid | Payment is final  |

## Related Endpoints

* [Get Payment](/api-reference/payments/get) - Check current status
* [List Payments](/api-reference/payments/list) - Find payments to reconcile
* [Cancel Payment](/api-reference/payments/cancel) - Cancel instead of paying


## OpenAPI

````yaml POST /v1/payments/{paymentId}/mark-paid
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
  /v1/payments/{paymentId}/mark-paid:
    post:
      tags:
        - Payments
      summary: Mark payment as paid
      description: >-
        Manually marks a payment as paid. Use for offline payments (check, wire
        transfer, cash).
      operationId: markPaymentPaid
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
                paymentReference:
                  type: string
                notes:
                  type: string
      responses:
        '200':
          description: Payment marked as paid
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
          description: Bad request (payment already paid/cancelled)
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