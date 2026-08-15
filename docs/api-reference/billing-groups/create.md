> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Create Billing Group

> Creates a new billing group for consolidated B2B billing. Groups multiple subscriptions under one customer for a single monthly invoice. All subscriptions in the group are billed on the same day each month.

## Overview

Create a billing group to consolidate multiple subscriptions into a single monthly invoice. This is ideal for B2B customers with multiple devices who prefer simplified billing.

<Info>
  Billing groups are typically used for business customers. Individual customers usually have separate billing per subscription.
</Info>

## Request Fields

| Field        | Required | Description                          |
| ------------ | -------- | ------------------------------------ |
| `customerId` | Yes      | Business customer ID                 |
| `groupName`  | Yes      | Display name for the group           |
| `rentalIds`  | Yes      | Array of subscription IDs to include |
| `billingDay` | Yes      | Day of month for billing (1-28)      |

## Example Request

```json theme={null}
{
  "customerId": "cust_abc123",
  "groupName": "Acme Corp - IT Department",
  "rentalIds": [
    "sub_001",
    "sub_002",
    "sub_003"
  ],
  "billingDay": 15
}
```

## What Happens

When you create a billing group:

1. **Group created** with specified subscriptions
2. **Subscriptions linked** to the billing group
3. **Future payments** consolidated to billing day
4. **Monthly total** calculated automatically

## Billing Day Selection

Choose a billing day that works for the customer:

| Day   | Typical Use                                       |
| ----- | ------------------------------------------------- |
| 1     | Start of month billing                            |
| 15    | Mid-month billing                                 |
| 25-28 | End of month (use 28 for all-month compatibility) |

<Warning>
  Use 28 or lower for billing day to ensure it exists in all months. Days 29-31 may cause issues in shorter months.
</Warning>

## Example: Create Group for New Business Customer

```javascript theme={null}
async function setupBusinessBilling(customerId, groupName, subscriptionIds) {
  // Verify all subscriptions belong to this customer
  for (const subId of subscriptionIds) {
    const sub = await getSubscription(subId);
    if (sub.customerId !== customerId) {
      throw new Error(`Subscription ${subId} belongs to different customer`);
    }
  }

  // Create billing group
  return await createBillingGroup({
    customerId,
    groupName,
    rentalIds: subscriptionIds,
    billingDay: 1 // Bill on 1st of each month
  });
}
```

## Error Handling

| Error Code                        | Cause                                      | Solution                               |
| --------------------------------- | ------------------------------------------ | -------------------------------------- |
| `CUSTOMER_NOT_FOUND`              | Invalid customer ID                        | Verify customer exists                 |
| `SUBSCRIPTION_NOT_FOUND`          | Invalid subscription ID                    | Verify subscription IDs                |
| `SUBSCRIPTION_DIFFERENT_CUSTOMER` | Subscription belongs to different customer | Only group same-customer subscriptions |
| `INVALID_BILLING_DAY`             | Day must be 1-28                           | Use valid billing day                  |

## Related Endpoints

* [List Billing Groups](/api-reference/billing-groups/list) - View all groups
* [Update Billing Group](/api-reference/billing-groups/update) - Add/remove subscriptions
* [Get Customer](/api-reference/customers/get) - Verify business customer


## OpenAPI

````yaml POST /v1/billing-groups
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
    post:
      tags:
        - Billing Groups
      summary: Create a billing group
      description: >-
        Creates a new billing group for consolidated B2B billing. Groups
        multiple subscriptions under one customer for a single monthly invoice.
        All subscriptions in the group are billed on the same day each month.
      operationId: createBillingGroup
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
                customerId:
                  type: string
                  minLength: 1
                groupName:
                  type: string
                  minLength: 1
                billingDay:
                  type: integer
                  minimum: 1
                  maximum: 28
                rentalIds:
                  type: array
                  items:
                    type: string
                  minItems: 1
                notes:
                  type: string
              required:
                - customerId
                - groupName
                - billingDay
                - rentalIds
            example:
              customerId: cust_abc123
              groupName: Acme Corp - IT Department
              billingDay: 15
              rentalIds:
                - rental_001
                - rental_002
                - rental_003
              notes: Net 30 payment terms agreed
      responses:
        '201':
          description: Billing group created
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
                  - message
                  - billingGroup
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