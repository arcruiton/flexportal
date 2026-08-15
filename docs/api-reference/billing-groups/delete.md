> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Delete Billing Group

> Deletes a billing group. Rentals are moved back to individual billing.

## Overview

Delete a billing group. Subscriptions in the group will revert to individual billing—they are **not** cancelled when the group is deleted.

## What Happens

When you delete a billing group:

1. **Group is removed**
2. **Subscriptions continue** with individual billing
3. **Future payments** scheduled separately per subscription
4. **Historical data** preserved for reporting

## Common Use Cases

* **Customer Reorganization**: Business customer restructuring
* **Individual Billing Preferred**: Customer wants separate invoices
* **Account Closure**: Customer ending relationship (after subscriptions end)

## Prerequisites

Before deleting, consider:

* Are there pending group payments that need to be processed?
* Should subscriptions move to a different group instead?

## Example: Delete with Transition

```javascript theme={null}
async function transitionToIndividualBilling(billingGroupId) {
  const group = await getBillingGroup(billingGroupId);

  // Log for records
  console.log(`Deleting group: ${group.groupName}`);
  console.log(`Subscriptions reverting to individual billing: ${group.rentalIds.length}`);

  // Delete the group
  await deleteBillingGroup(billingGroupId);

  return {
    deleted: true,
    affectedSubscriptions: group.rentalIds
  };
}
```

## Alternative: Deactivate Instead

If you want to preserve the group structure:

```javascript theme={null}
// Deactivate instead of delete
await updateBillingGroup(billingGroupId, {
  status: 'inactive'
});
```

## Error Handling

| Error Code  | Cause               | Solution                |
| ----------- | ------------------- | ----------------------- |
| `NOT_FOUND` | Group doesn't exist | Verify billing group ID |

## Related Endpoints

* [Get Billing Group](/api-reference/billing-groups/get) - Check group before deletion
* [Update Billing Group](/api-reference/billing-groups/update) - Alternative: deactivate
* [List Subscriptions](/api-reference/subscriptions/list) - View affected subscriptions


## OpenAPI

````yaml DELETE /v1/billing-groups/{billingGroupId}
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
    delete:
      tags:
        - Billing Groups
      summary: Delete a billing group
      description: Deletes a billing group. Rentals are moved back to individual billing.
      operationId: deleteBillingGroup
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
          description: Billing group deleted
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
                required:
                  - success
                  - message
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