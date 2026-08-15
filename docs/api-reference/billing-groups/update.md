> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Update Billing Group

> Updates billing group settings. Can add/remove rentals, change billing day, or update name.

## Overview

Update a billing group's settings, add or remove subscriptions, or change the billing day. Use this to manage consolidated B2B billing as customer needs change.

## Updatable Fields

| Field        | Description                                   |
| ------------ | --------------------------------------------- |
| `groupName`  | Display name                                  |
| `rentalIds`  | Array of subscription IDs (replaces existing) |
| `billingDay` | Day of month for billing (1-28)               |
| `status`     | `active` or `inactive`                        |

## Example: Add Subscription to Group

```json theme={null}
{
  "rentalIds": ["sub_001", "sub_002", "sub_003", "sub_004"]
}
```

<Warning>
  The `rentalIds` array **replaces** the existing subscriptions. Include all subscriptions you want in the group, not just new ones.
</Warning>

## Example: Change Billing Day

```json theme={null}
{
  "billingDay": 15
}
```

## Example: Rename Group

```json theme={null}
{
  "groupName": "Acme Corp - Engineering Team"
}
```

## Common Operations

### Add New Subscription

```javascript theme={null}
async function addToGroup(billingGroupId, newSubscriptionId) {
  const group = await getBillingGroup(billingGroupId);

  // Add new subscription to existing list
  const updatedRentalIds = [...group.rentalIds, newSubscriptionId];

  return await updateBillingGroup(billingGroupId, {
    rentalIds: updatedRentalIds
  });
}
```

### Remove Subscription

```javascript theme={null}
async function removeFromGroup(billingGroupId, subscriptionIdToRemove) {
  const group = await getBillingGroup(billingGroupId);

  // Filter out the subscription to remove
  const updatedRentalIds = group.rentalIds.filter(
    id => id !== subscriptionIdToRemove
  );

  return await updateBillingGroup(billingGroupId, {
    rentalIds: updatedRentalIds
  });
}
```

### Deactivate Group

```javascript theme={null}
async function deactivateGroup(billingGroupId) {
  return await updateBillingGroup(billingGroupId, {
    status: 'inactive'
  });
}
```

## Error Handling

| Error Code                        | Cause                                      | Solution                                 |
| --------------------------------- | ------------------------------------------ | ---------------------------------------- |
| `NOT_FOUND`                       | Group doesn't exist                        | Verify billing group ID                  |
| `SUBSCRIPTION_NOT_FOUND`          | Invalid subscription in array              | Verify all subscription IDs              |
| `SUBSCRIPTION_DIFFERENT_CUSTOMER` | Subscription belongs to different customer | Only include same-customer subscriptions |

## Related Endpoints

* [Get Billing Group](/api-reference/billing-groups/get) - View current state
* [Delete Billing Group](/api-reference/billing-groups/delete) - Remove group
* [List Subscriptions](/api-reference/subscriptions/list) - Find subscriptions to add


## OpenAPI

````yaml PATCH /v1/billing-groups/{billingGroupId}
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
    patch:
      tags:
        - Billing Groups
      summary: Update a billing group
      description: >-
        Updates billing group settings. Can add/remove rentals, change billing
        day, or update name.
      operationId: updateBillingGroup
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
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
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
                notes:
                  type: string
                status:
                  type: string
                  enum:
                    - active
                    - inactive
      responses:
        '200':
          description: Billing group updated
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