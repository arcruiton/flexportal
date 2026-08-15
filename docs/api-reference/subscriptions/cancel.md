> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Cancel Subscription

> Cancels an active subscription. Use when customer wants to end subscription without returning device immediately.

## Overview

Cancel an active subscription. Use this when a customer wants to terminate their subscription without going through the normal end-of-contract flow. Unlike early return, cancellation doesn't immediately trigger a device return.

## When to Use Cancellation

| Scenario                               | Use This                                                  |
| -------------------------------------- | --------------------------------------------------------- |
| Customer requests termination          | **Cancel**                                                |
| Repeated payment failures              | **Cancel**                                                |
| Fraud detected                         | **Cancel**                                                |
| Customer wants device back immediately | [Early Return](/api-reference/subscriptions/early-return) |
| Customer wants to purchase device      | [Buyout](/api-reference/subscriptions/buyout)             |

## Request Fields

| Field      | Required | Description                             |
| ---------- | -------- | --------------------------------------- |
| `rentalId` | Yes      | The subscription ID to cancel           |
| `reason`   | Yes      | Cancellation reason (see options below) |
| `notes`    | No       | Additional notes (max 1000 chars)       |

## Reason Options

| Reason             | When to Use                        |
| ------------------ | ---------------------------------- |
| `customer_request` | Customer asked to end subscription |
| `payment_failure`  | Repeated failed payment attempts   |
| `fraud`            | Fraudulent activity detected       |
| `admin_decision`   | Internal business decision         |
| `other`            | Other reasons (specify in notes)   |

## Example Request

```json theme={null}
{
  "rentalId": "sub_abc123",
  "reason": "customer_request",
  "notes": "Customer relocating internationally"
}
```

## What Happens

When you cancel a subscription:

1. **Subscription status** changes to `cancelled`
2. **Future payments** are voided
3. **Asset** marked for return collection
4. **Cancellation** logged with reason and timestamp

## Response Fields

| Field               | Description                        |
| ------------------- | ---------------------------------- |
| `success`           | Always `true` on success           |
| `rentalId`          | The cancelled subscription ID      |
| `assetSerialNumber` | Serial number of device to collect |

## Example: Cancel with Payment Failure

```javascript theme={null}
async function cancelForNonPayment(subscriptionId, failedAttempts) {
  const subscription = await getSubscription(subscriptionId);

  return await cancelSubscription(subscriptionId, {
    rentalId: subscriptionId,
    reason: 'payment_failure',
    notes: `Cancelled after ${failedAttempts} failed payment attempts`
  });
}
```

## Example: Customer-Initiated Cancellation

```javascript theme={null}
async function processCancellationRequest(subscriptionId, customerReason) {
  // Log the cancellation
  await cancelSubscription(subscriptionId, {
    rentalId: subscriptionId,
    reason: 'customer_request',
    notes: customerReason
  });

  // Schedule device collection
  const subscription = await getSubscription(subscriptionId);
  await scheduleCollection(subscription.assetSerialNumber, subscription.customerId);
}
```

## Cancellation vs Early Return

| Aspect            | Cancel                     | Early Return                 |
| ----------------- | -------------------------- | ---------------------------- |
| Primary use       | Administrative termination | Customer-initiated return    |
| Device return     | Scheduled separately       | Immediate return expected    |
| Fees              | No automatic fee           | May include early return fee |
| Typical scenarios | Payment issues, fraud      | Customer doesn't want device |

## Error Handling

| Error Code          | Cause                          | Solution                              |
| ------------------- | ------------------------------ | ------------------------------------- |
| `NOT_FOUND`         | Subscription doesn't exist     | Verify subscription ID                |
| `ALREADY_CANCELLED` | Subscription already cancelled | No action needed                      |
| `ALREADY_ENDED`     | Subscription already ended     | Cannot cancel completed subscriptions |

## Related Endpoints

* [Early Return](/api-reference/subscriptions/early-return) - Return device and end subscription
* [Get Subscription](/api-reference/subscriptions/get) - Check current status
* [List Subscriptions](/api-reference/subscriptions/list) - Find subscriptions to cancel


## OpenAPI

````yaml POST /v1/subscriptions/{subscriptionId}/cancel
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
  /v1/subscriptions/{subscriptionId}/cancel:
    post:
      tags:
        - Subscriptions
      summary: Cancel a subscription
      description: >-
        Cancels an active subscription. Use when customer wants to end
        subscription without returning device immediately.
      operationId: cancelSubscription
      parameters:
        - schema:
            type: string
            description: The subscription ID
          required: true
          name: subscriptionId
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
                rentalId:
                  type: string
                  minLength: 1
                reason:
                  type: string
                  enum:
                    - customer_request
                    - payment_failure
                    - fraud
                    - admin_decision
                    - other
                notes:
                  type: string
                  maxLength: 1000
              required:
                - rentalId
                - reason
      responses:
        '200':
          description: Subscription cancelled
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    enum:
                      - true
                  rentalId:
                    type: string
                  assetSerialNumber:
                    type: string
                  previousStatus:
                    type: string
                    enum:
                      - active
                  cancelledAt:
                    type: string
                  message:
                    type: string
                required:
                  - success
                  - rentalId
                  - assetSerialNumber
                  - previousStatus
                  - cancelledAt
                  - message
        '400':
          description: Bad request (subscription not cancellable)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '404':
          description: Subscription not found
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