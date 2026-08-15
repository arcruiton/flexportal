> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Delete Customer

> Soft deletes a customer by setting status to inactive.

## Overview

Deactivate a customer by marking them as inactive. This is a **soft delete**—the customer record is preserved for historical data integrity but hidden from active customer lists.

<Warning>
  Customers with active subscriptions cannot be deleted. Cancel or complete all subscriptions first.
</Warning>

## What Happens When You Delete a Customer

1. **Customer status** changes to `inactive`
2. **Customer hidden** from default list queries
3. **Historical orders** and subscriptions preserved
4. **New orders** cannot be created for this customer
5. **Reporting data** remains intact

## Common Use Cases

* **Data Cleanup**: Remove test customers or duplicate records
* **Account Closure**: Customer requested account deletion
* **Compliance**: Remove inactive customers per data retention policies
* **Fraud Prevention**: Disable accounts flagged for suspicious activity

## Prerequisites

Before deleting a customer, ensure:

1. No active subscriptions
2. No pending orders
3. All devices returned (if applicable)

```javascript theme={null}
async function canDeleteCustomer(customerId) {
  const customer = await getCustomer(customerId);

  // Check for active subscriptions
  if (customer.profitability.activeDevices > 0) {
    console.log('Cannot delete: Customer has active subscriptions');
    return false;
  }

  // Check for pending orders
  const { orders } = await listOrders({
    customerId,
    status: 'pending'
  });

  if (orders.length > 0) {
    console.log('Cannot delete: Customer has pending orders');
    return false;
  }

  return true;
}
```

## Reactivating a Customer

To reactivate a deleted customer, use [Update Customer](/api-reference/customers/update):

```json theme={null}
PUT /v1/customers/{customerId}
{
  "status": "active"
}
```

## Data Retention

After deletion:

| Data                 | Status                     |
| -------------------- | -------------------------- |
| Customer profile     | Preserved, marked inactive |
| Order history        | Preserved                  |
| Subscription history | Preserved                  |
| Payment history      | Preserved                  |
| Addresses            | Preserved                  |

<Info>
  Soft deletion ensures data integrity for financial reporting, auditing, and compliance requirements.
</Info>

## Error Handling

| Error Code                          | Cause                                   | Solution                        |
| ----------------------------------- | --------------------------------------- | ------------------------------- |
| `NOT_FOUND`                         | Customer doesn't exist                  | Verify customer ID              |
| `CUSTOMER_HAS_ACTIVE_SUBSCRIPTIONS` | Cannot delete with active subscriptions | Cancel subscriptions first      |
| `CUSTOMER_HAS_PENDING_ORDERS`       | Cannot delete with pending orders       | Complete or cancel orders first |

## Related Endpoints

* [Get Customer](/api-reference/customers/get) - Check customer status before deletion
* [Update Customer](/api-reference/customers/update) - Reactivate deleted customer
* [List Subscriptions](/api-reference/subscriptions/list) - Check for active subscriptions


## OpenAPI

````yaml DELETE /v1/customers/{customerId}
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
  /v1/customers/{customerId}:
    delete:
      tags:
        - Customers
      summary: Delete a customer
      description: Soft deletes a customer by setting status to inactive.
      operationId: deleteCustomer
      parameters:
        - schema:
            type: string
            description: The customer ID
          required: true
          name: customerId
          in: path
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: Customer deleted
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
                  customerId:
                    type: string
                required:
                  - success
                  - message
                  - customerId
        '404':
          description: Customer not found
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