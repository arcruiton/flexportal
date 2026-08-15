> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# List Customers

> Returns a paginated list of customers.

## Overview

Retrieve a paginated list of customers with optional filtering and sorting. Customers are automatically created when orders are placed—you don't need to create them separately.

## Customer Creation

Customers are created automatically when:

1. An order is placed with a new email address
2. The system creates a customer record linked to that email

Subsequent orders with the same email are linked to the existing customer.

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Customer Directory" icon="address-book">
    Build customer management interfaces for your support or sales teams
  </Card>

  <Card title="CRM Integration" icon="plug">
    Sync customer data to external CRM systems like Salesforce or HubSpot
  </Card>

  <Card title="Reporting" icon="chart-pie">
    Generate customer reports, segment customers, or analyze customer base
  </Card>

  <Card title="Support Lookup" icon="headset">
    Find customers by email or name to assist with support inquiries
  </Card>
</CardGroup>

## Filtering Customers

```bash theme={null}
# Get active customers
GET /v1/customers?status=active

# Find customer by email
GET /v1/customers?email=john@example.com

# Get business customers only
GET /v1/customers?customerType=business

# Get customers with active subscriptions
GET /v1/customers?hasActiveRentals=true

# Combine filters
GET /v1/customers?status=active&customerType=business&hasActiveRentals=true
```

## Sorting Options

| Field                 | Description                                |
| --------------------- | ------------------------------------------ |
| `createdAt`           | Customer creation date (default)           |
| `firstName`           | First name alphabetically                  |
| `lastName`            | Last name alphabetically                   |
| `email`               | Email address alphabetically               |
| `totalMonthlyRevenue` | Current monthly revenue from this customer |
| `totalDevicesRented`  | Number of active subscriptions             |

```bash theme={null}
# Sort by highest revenue customers
GET /v1/customers?sortBy=totalMonthlyRevenue&sortDir=desc

# Sort by most recent customers
GET /v1/customers?sortBy=createdAt&sortDir=desc
```

## Response Fields

Key fields in each customer object:

| Field                 | Description                           |
| --------------------- | ------------------------------------- |
| `customerId`          | Unique customer identifier            |
| `email`               | Customer email address                |
| `firstName`           | First name                            |
| `lastName`            | Last name                             |
| `company`             | Company name (for business customers) |
| `phone`               | Phone number                          |
| `customerType`        | `individual` or `business`            |
| `status`              | `active` or `inactive`                |
| `totalDevicesRented`  | Number of active subscriptions        |
| `totalMonthlyRevenue` | Current MRR from this customer        |
| `createdAt`           | ISO 8601 timestamp                    |

## Example: Find High-Value Customers

```javascript theme={null}
// Get top 10 customers by monthly revenue
const { customers } = await listCustomers({
  status: 'active',
  hasActiveRentals: true,
  sortBy: 'totalMonthlyRevenue',
  sortDir: 'desc',
  limit: 10
});

for (const customer of customers) {
  console.log(`${customer.firstName} ${customer.lastName}: €${customer.totalMonthlyRevenue}/mo`);
}
```

## Related Endpoints

* [Get Customer](/api-reference/customers/get) - Retrieve customer with profitability metrics
* [Update Customer](/api-reference/customers/update) - Modify customer details
* [List Orders](/api-reference/orders/list) - View customer's orders
* [List Subscriptions](/api-reference/subscriptions/list) - View customer's subscriptions


## OpenAPI

````yaml GET /v1/customers
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
  /v1/customers:
    get:
      tags:
        - Customers
      summary: List customers
      description: Returns a paginated list of customers.
      operationId: listCustomers
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
            description: Filter by status (active, inactive)
          required: false
          name: status
          in: query
        - schema:
            type: string
            description: Filter by type (individual, business)
          required: false
          name: customerType
          in: query
        - schema:
            type: string
            description: Filter by exact email match
          required: false
          name: email
          in: query
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: List of customers
          content:
            application/json:
              schema:
                type: object
                properties:
                  customers:
                    type: array
                    items:
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
                  count:
                    type: number
                  limit:
                    type: number
                  hasMore:
                    type: boolean
                  nextCursor:
                    type:
                      - string
                      - 'null'
                required:
                  - customers
                  - count
                  - limit
                  - hasMore
                  - nextCursor
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      description: API key obtained from FlexPortal dashboard

````