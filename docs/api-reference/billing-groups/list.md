> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# List Billing Groups

> Returns a list of billing groups for consolidated B2B billing.

## Overview

Retrieve a list of billing groups. Billing groups are a B2B feature that consolidates multiple subscriptions for a single customer into one monthly invoice, simplifying billing for business customers with many devices.

## What Are Billing Groups?

Instead of billing each subscription separately:

```
Without Billing Group:
  Subscription 1 → Invoice 1 (€129)
  Subscription 2 → Invoice 2 (€89)
  Subscription 3 → Invoice 3 (€159)
  = 3 separate invoices/payments
```

With a billing group:

```
With Billing Group:
  Subscription 1 ─┐
  Subscription 2 ─┼→ Single Invoice (€377)
  Subscription 3 ─┘
  = 1 consolidated invoice/payment
```

## Common Use Cases

<CardGroup cols={2}>
  <Card title="B2B Account Management" icon="building">
    Manage billing groups for business customers
  </Card>

  <Card title="Invoice Consolidation" icon="file-invoice">
    View which subscriptions are grouped for billing
  </Card>

  <Card title="Billing Operations" icon="calculator">
    Monitor monthly billing totals per customer
  </Card>

  <Card title="Customer Portal" icon="user-tie">
    Show business customers their billing groups
  </Card>
</CardGroup>

## Filtering Billing Groups

```bash theme={null}
# Get billing groups for a customer
GET /v1/billing-groups?customerId=cust_abc123

# Get active billing groups
GET /v1/billing-groups?status=active
```

## Response Fields

| Field                | Description                             |
| -------------------- | --------------------------------------- |
| `billingGroupId`     | Unique identifier                       |
| `groupName`          | Display name for the group              |
| `customerId`         | Associated business customer            |
| `rentalIds`          | Array of subscription IDs in this group |
| `billingDay`         | Day of month for billing (1-28)         |
| `totalMonthlyAmount` | Combined monthly total                  |
| `currency`           | Currency code                           |
| `status`             | `active` or `inactive`                  |
| `createdAt`          | ISO 8601 timestamp                      |

## Example: Customer Billing Summary

```javascript theme={null}
async function getCustomerBillingSummary(customerId) {
  const { billingGroups } = await listBillingGroups({ customerId });

  return billingGroups.map(group => ({
    groupName: group.groupName,
    deviceCount: group.rentalIds.length,
    monthlyTotal: `${group.currency} ${group.totalMonthlyAmount}`,
    billingDay: group.billingDay
  }));
}
```

## Related Endpoints

* [Get Billing Group](/api-reference/billing-groups/get) - View group details
* [Create Billing Group](/api-reference/billing-groups/create) - Create new group
* [Update Billing Group](/api-reference/billing-groups/update) - Modify group
* [List Subscriptions](/api-reference/subscriptions/list) - View grouped subscriptions


## OpenAPI

````yaml GET /v1/billing-groups
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
  /v1/billing-groups:
    get:
      tags:
        - Billing Groups
      summary: List billing groups
      description: Returns a list of billing groups for consolidated B2B billing.
      operationId: listBillingGroups
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
            description: Filter by customer ID
          required: false
          name: customerId
          in: query
        - schema:
            type: string
            description: Filter by status (active, inactive)
          required: false
          name: status
          in: query
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: List of billing groups
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    enum:
                      - true
                  billingGroups:
                    type: array
                    items:
                      type: object
                      properties:
                        billingGroupId:
                          type: string
                          minLength: 1
                        tenantId:
                          type: string
                          minLength: 1
                        customerId:
                          type: string
                          minLength: 1
                        groupName:
                          type: string
                          minLength: 1
                        rentalIds:
                          type: array
                          items:
                            type: string
                          default: []
                        billingDay:
                          type: integer
                          minimum: 1
                          maximum: 28
                        totalMonthlyAmount:
                          type: number
                          minimum: 0
                        activeRentalCount:
                          type: integer
                          minimum: 0
                          default: 0
                        currency:
                          type: string
                          minLength: 3
                          maxLength: 3
                        status:
                          type: string
                          enum:
                            - active
                            - inactive
                        createdBy:
                          type: string
                          minLength: 1
                        notes:
                          type: string
                        createdAt:
                          type: string
                        updatedAt:
                          type: string
                      required:
                        - billingGroupId
                        - tenantId
                        - customerId
                        - groupName
                        - billingDay
                        - totalMonthlyAmount
                        - currency
                        - status
                        - createdBy
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
                  - billingGroups
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