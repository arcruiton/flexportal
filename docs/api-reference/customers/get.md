> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Customer

> Retrieves a specific customer by ID.

## Overview

Retrieve complete details for a single customer, including profitability metrics and subscription summary. Use this endpoint for customer detail pages, support lookups, or profitability analysis.

## Common Use Cases

* **Customer Profile Page**: Display complete customer information and subscription history
* **Support Lookup**: Quickly find customer details during support calls
* **Profitability Analysis**: Review customer lifetime value and cost recovery metrics
* **Pre-Order Check**: Verify customer details before processing new orders

## Profitability Metrics

The customer response includes valuable profitability data:

```json theme={null}
{
  "profitability": {
    "lifetimeCollected": 4250.00,
    "totalAcquisitionCost": 3600.00,
    "costRecoveryPercent": 118.05,
    "averageMonthlyRevenue": 354.17,
    "totalDevicesEver": 3,
    "activeDevices": 2
  }
}
```

| Metric                  | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `lifetimeCollected`     | Total payments collected from this customer          |
| `totalAcquisitionCost`  | Total cost of assets provided to customer            |
| `costRecoveryPercent`   | (Collected / Cost) × 100—shows overall profitability |
| `averageMonthlyRevenue` | Average monthly revenue from this customer           |
| `totalDevicesEver`      | Total devices ever subscribed                        |
| `activeDevices`         | Currently active subscriptions                       |

## Customer Types

| Type         | Description       | Typical Use                                  |
| ------------ | ----------------- | -------------------------------------------- |
| `individual` | Personal customer | Consumer subscriptions                       |
| `business`   | Business customer | B2B subscriptions, often with billing groups |

## Address Information

Customer records include billing and shipping addresses:

```json theme={null}
{
  "billingAddress": {
    "contactName": "John Smith",
    "streetAddress": "123 Main Street",
    "city": "Amsterdam",
    "postalCode": "1012 AB",
    "country": "Netherlands"
  },
  "shippingAddress": {
    "contactName": "John Smith",
    "company": "Acme Corp",
    "streetAddress": "456 Office Park",
    "city": "Rotterdam",
    "postalCode": "3011 AA",
    "country": "Netherlands"
  }
}
```

## Example: Customer Summary for Support

```javascript theme={null}
async function getCustomerSummary(customerId) {
  const customer = await getCustomer(customerId);

  return {
    name: `${customer.firstName} ${customer.lastName}`,
    email: customer.email,
    company: customer.company || 'Individual',
    activeSubscriptions: customer.profitability.activeDevices,
    monthlyRevenue: customer.profitability.averageMonthlyRevenue,
    lifetimeValue: customer.profitability.lifetimeCollected,
    isProfitable: customer.profitability.costRecoveryPercent >= 100
  };
}
```

## Example: Check Customer Eligibility

```javascript theme={null}
async function canCustomerUpgrade(customerId) {
  const customer = await getCustomer(customerId);

  // Business logic: Only allow upgrades for customers in good standing
  const hasActiveSubscriptions = customer.profitability.activeDevices > 0;
  const isActive = customer.status === 'active';

  return hasActiveSubscriptions && isActive;
}
```

## Related Endpoints

* [List Customers](/api-reference/customers/list) - Browse all customers
* [Update Customer](/api-reference/customers/update) - Modify customer details
* [List Subscriptions](/api-reference/subscriptions/list) - Get customer's subscriptions
* [List Orders](/api-reference/orders/list) - Get customer's order history


## OpenAPI

````yaml GET /v1/customers/{customerId}
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
    get:
      tags:
        - Customers
      summary: Get a customer
      description: Retrieves a specific customer by ID.
      operationId: getCustomer
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
          description: Customer details
          content:
            application/json:
              schema:
                type: object
                properties:
                  customerId:
                    type: string
                  tenantId:
                    type: string
                  email:
                    type: string
                  firstName:
                    type: string
                  lastName:
                    type: string
                  company:
                    type: string
                  phone:
                    type: string
                  customerType:
                    type: string
                    enum:
                      - individual
                      - business
                  customFields:
                    type: object
                    additionalProperties: {}
                  totalOrders:
                    type: number
                  totalDevicesRented:
                    type: number
                  totalMonthlyRevenue:
                    type: number
                  status:
                    type: string
                    enum:
                      - active
                      - inactive
                  orderIds:
                    type: array
                    items:
                      type: string
                  rentalIds:
                    type: array
                    items:
                      type: string
                  lastBillingAddress:
                    type: object
                    properties:
                      contactName:
                        type: string
                      company:
                        type: string
                      buildingInfo:
                        type: string
                      streetAddress:
                        type: string
                      locality:
                        type: string
                      city:
                        type: string
                      adminArea:
                        type: string
                      postalCode:
                        type:
                          - string
                          - 'null'
                      country:
                        type: string
                    required:
                      - contactName
                      - streetAddress
                      - city
                      - country
                  lastShippingAddress:
                    type: object
                    properties:
                      contactName:
                        type: string
                      company:
                        type: string
                      buildingInfo:
                        type: string
                      streetAddress:
                        type: string
                      locality:
                        type: string
                      city:
                        type: string
                      adminArea:
                        type: string
                      postalCode:
                        type:
                          - string
                          - 'null'
                      country:
                        type: string
                    required:
                      - contactName
                      - streetAddress
                      - city
                      - country
                  createdAt: {}
                  updatedAt: {}
                  createdBy:
                    type: string
                  lifetimeCollected:
                    type: number
                  totalAcquisitionCost:
                    type: number
                  customerMargin:
                    type: number
                  customerMarginPercent:
                    type: number
                  subscriptionsTracked:
                    type: number
                required:
                  - customerId
                  - tenantId
                  - email
                  - firstName
                  - lastName
                  - customerType
                  - totalOrders
                  - totalDevicesRented
                  - totalMonthlyRevenue
                  - status
                  - orderIds
                  - rentalIds
                  - createdBy
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