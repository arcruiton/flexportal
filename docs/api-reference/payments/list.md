> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# List Payments

> Returns a paginated list of payments with optional filtering by status, customer, or rental.

## Overview

Retrieve a paginated list of payments with optional filtering and sorting. Payments represent scheduled or completed billing transactions for subscriptions—they track when payments are due, their status, and when they were collected.

## Payment Lifecycle

```
Scheduled → Pending → Processing → Paid/Failed/Cancelled
```

| Status       | Description                          |
| ------------ | ------------------------------------ |
| `pending`    | Payment scheduled, not yet attempted |
| `processing` | Payment attempt in progress          |
| `paid`       | Payment successfully collected       |
| `failed`     | Payment attempt failed               |
| `cancelled`  | Payment was cancelled                |

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Accounts Receivable" icon="file-invoice-dollar">
    Track pending payments and outstanding balances
  </Card>

  <Card title="Collection Dashboard" icon="hand-holding-dollar">
    Monitor failed payments that need attention
  </Card>

  <Card title="Cash Flow Forecasting" icon="chart-line">
    Project upcoming revenue from scheduled payments
  </Card>

  <Card title="Customer Billing History" icon="history">
    View payment history for specific customers
  </Card>
</CardGroup>

## Filtering Payments

```bash theme={null}
# Get pending payments
GET /v1/payments?status=pending

# Get failed payments that need attention
GET /v1/payments?status=failed

# Get payments for a specific customer
GET /v1/payments?customerId=cust_abc123

# Get payments for a subscription
GET /v1/payments?rentalId=sub_xyz789

# Get payments by due date range
GET /v1/payments?dueDateFrom=2025-01-01&dueDateTo=2025-01-31

# Get payments for a billing group
GET /v1/payments?billingGroupId=bg_abc123
```

## Response Fields

Key fields in each payment object:

| Field            | Description                          |
| ---------------- | ------------------------------------ |
| `paymentId`      | Unique payment identifier            |
| `status`         | Current payment status               |
| `customerId`     | Customer ID                          |
| `rentalId`       | Associated subscription ID           |
| `billingGroupId` | Billing group (if applicable)        |
| `amount`         | Payment amount                       |
| `currency`       | Currency code (EUR, USD, etc.)       |
| `dueDate`        | When payment is due                  |
| `paidAt`         | When payment was collected (if paid) |
| `createdAt`      | ISO 8601 timestamp                   |

## Example: Get Outstanding Balance

```javascript theme={null}
async function getOutstandingBalance(customerId) {
  const { payments } = await listPayments({
    customerId,
    status: 'pending'
  });

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return {
    customerId,
    pendingPayments: payments.length,
    totalOutstanding: total,
    currency: payments[0]?.currency || 'EUR'
  };
}
```

## Example: Upcoming Revenue Forecast

```javascript theme={null}
async function getRevenueForecast(daysAhead) {
  const today = new Date();
  const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  const { payments } = await listPayments({
    status: 'pending',
    dueDateFrom: today.toISOString().split('T')[0],
    dueDateTo: futureDate.toISOString().split('T')[0]
  });

  return {
    period: `Next ${daysAhead} days`,
    expectedPayments: payments.length,
    expectedRevenue: payments.reduce((sum, p) => sum + p.amount, 0)
  };
}
```

## Related Endpoints

* [Get Payment](/api-reference/payments/get) - Get payment details
* [Mark Paid](/api-reference/payments/mark-paid) - Manually mark as paid
* [Cancel Payment](/api-reference/payments/cancel) - Cancel a payment
* [List Subscriptions](/api-reference/subscriptions/list) - View related subscriptions


## OpenAPI

````yaml GET /v1/payments
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
  /v1/payments:
    get:
      tags:
        - Payments
      summary: List payments
      description: >-
        Returns a paginated list of payments with optional filtering by status,
        customer, or rental.
      operationId: listPayments
      parameters:
        - schema:
            type: string
            description: 'Items per page (default: 50, max: 100)'
          required: false
          name: limit
          in: query
        - schema:
            type: string
            description: Cursor for pagination
          required: false
          name: startAfter
          in: query
        - schema:
            type: string
            description: Filter by status (pending, processing, paid, failed, cancelled)
          required: false
          name: status
          in: query
        - schema:
            type: string
            description: Filter by customer ID
          required: false
          name: customerId
          in: query
        - schema:
            type: string
            description: Filter by rental ID
          required: false
          name: rentalId
          in: query
        - schema:
            type: string
            description: Filter by billing group ID
          required: false
          name: billingGroupId
          in: query
        - schema:
            type: string
            description: Filter by due date from (ISO 8601)
          required: false
          name: dueDateFrom
          in: query
        - schema:
            type: string
            description: Filter by due date to (ISO 8601)
          required: false
          name: dueDateTo
          in: query
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: List of payments
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    enum:
                      - true
                  payments:
                    type: array
                    items:
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
                  count:
                    type: number
                  hasMore:
                    type: boolean
                  nextCursor:
                    type:
                      - string
                      - 'null'
                required:
                  - success
                  - payments
                  - count
                  - hasMore
                  - nextCursor
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      description: API key obtained from FlexPortal dashboard

````