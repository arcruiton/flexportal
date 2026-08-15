> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Billing Group

> Retrieves a specific billing group by ID.

## Overview

Retrieve details for a single billing group, including all associated subscriptions and the consolidated billing amount.

## Response Fields

| Field                | Description                     |
| -------------------- | ------------------------------- |
| `billingGroupId`     | Unique identifier               |
| `groupName`          | Display name                    |
| `customerId`         | Business customer ID            |
| `rentalIds`          | Array of subscription IDs       |
| `billingDay`         | Day of month for billing (1-28) |
| `totalMonthlyAmount` | Sum of all subscription amounts |
| `currency`           | Currency code                   |
| `status`             | `active` or `inactive`          |
| `createdAt`          | When group was created          |
| `updatedAt`          | Last modification               |

## Common Use Cases

* **Invoice Preview**: Show what the consolidated invoice will include
* **Group Management**: View and verify subscriptions in a group
* **Billing Inquiries**: Answer customer questions about grouped billing

## Example: Invoice Breakdown

```javascript theme={null}
async function getInvoiceBreakdown(billingGroupId) {
  const group = await getBillingGroup(billingGroupId);

  // Get details for each subscription in the group
  const subscriptions = await Promise.all(
    group.rentalIds.map(id => getSubscription(id))
  );

  return {
    groupName: group.groupName,
    billingDay: group.billingDay,
    items: subscriptions.map(sub => ({
      product: sub.productName,
      serialNumber: sub.serialNumber,
      monthlyAmount: sub.monthlyAmount
    })),
    total: group.totalMonthlyAmount,
    currency: group.currency
  };
}
```

## Related Endpoints

* [List Billing Groups](/api-reference/billing-groups/list) - Browse all groups
* [Update Billing Group](/api-reference/billing-groups/update) - Modify group
* [Get Subscription](/api-reference/subscriptions/get) - View subscription details


## OpenAPI

````yaml GET /v1/billing-groups/{billingGroupId}
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
  /v1/billing-groups/{billingGroupId}:
    get:
      tags:
        - Billing Groups
      summary: Get a billing group
      description: Retrieves a specific billing group by ID.
      operationId: getBillingGroup
      parameters:
        - schema:
            type: string
            description: The billing group ID
          required: true
          name: billingGroupId
          in: path
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: Billing group details
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    enum:
                      - true
                  billingGroup:
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
                required:
                  - success
                  - billingGroup
        '404':
          description: Billing group not found
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