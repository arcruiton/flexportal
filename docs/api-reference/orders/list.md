> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# List Orders

> Returns a paginated list of orders.

## Overview

Retrieve a paginated list of orders with optional filtering and sorting. Orders represent subscription checkout transactions—each order contains customer information, line items with products and pricing, and fulfillment status.

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Dashboard Integration" icon="chart-line">
    Build custom dashboards showing recent orders, fulfillment queues, or revenue reports
  </Card>

  <Card title="Order Management" icon="list-check">
    Display order lists for your operations team to process and fulfill
  </Card>

  <Card title="Customer Portal" icon="user">
    Show customers their order history in your customer-facing application
  </Card>

  <Card title="Sync & Export" icon="arrows-rotate">
    Sync orders to external systems like ERPs, accounting software, or data warehouses
  </Card>
</CardGroup>

## Filtering Orders

Filter orders by status to power different views in your application:

| Status      | Description                            | Typical Action                         |
| ----------- | -------------------------------------- | -------------------------------------- |
| `pending`   | Order submitted, awaiting confirmation | Review and confirm                     |
| `confirmed` | Order confirmed, ready for fulfillment | Assign assets and create subscriptions |
| `partial`   | Some items fulfilled, others pending   | Continue fulfillment                   |
| `fulfilled` | All items have active subscriptions    | Archive or monitor                     |
| `cancelled` | Order was cancelled                    | No action needed                       |

```bash theme={null}
# Get orders awaiting fulfillment
GET /v1/orders?status=confirmed

# Get orders for a specific customer
GET /v1/orders?customerId=cust_abc123

# Combine filters
GET /v1/orders?status=pending&sortBy=createdAt&sortDir=asc
```

## Sorting Options

| Field          | Description                        |
| -------------- | ---------------------------------- |
| `createdAt`    | Order creation timestamp (default) |
| `updatedAt`    | Last modification timestamp        |
| `orderId`      | Order ID (alphabetical)            |
| `status`       | Order status                       |
| `totals.total` | Order total amount                 |

## Pagination

Results are paginated using cursor-based pagination. See [Pagination](/api-reference/overview#pagination) for details.

```javascript theme={null}
// Fetch all pending orders
const pendingOrders = [];
let cursor = null;

do {
  const params = new URLSearchParams({ status: 'pending', limit: '50' });
  if (cursor) params.set('startAfter', cursor);

  const { orders, nextCursor } = await fetchOrders(params);
  pendingOrders.push(...orders);
  cursor = nextCursor;
} while (cursor);
```

## Response Fields

Key fields in each order object:

| Field            | Description                                        |
| ---------------- | -------------------------------------------------- |
| `orderId`        | Unique order identifier                            |
| `status`         | Current order status                               |
| `orderType`      | `standard`, `extension`, or `upgrade`              |
| `customer`       | Customer details (email, name, company)            |
| `items`          | Array of line items with SKU, quantity, pricing    |
| `totals`         | Order totals (subtotal, tax, total, currency)      |
| `rentalProgress` | Fulfillment progress (totalDevices, rentedDevices) |
| `createdAt`      | ISO 8601 timestamp                                 |

## Related Endpoints

* [Get Order](/api-reference/orders/get) - Retrieve a single order by ID
* [Create Order](/api-reference/orders/create) - Create a new subscription order
* [Create Subscription](/api-reference/subscriptions/create) - Fulfill order items by creating subscriptions


## OpenAPI

````yaml GET /v1/orders
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
  /v1/orders:
    get:
      tags:
        - Orders
      summary: List orders
      description: Returns a paginated list of orders.
      operationId: listOrders
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
            description: >-
              Filter by status (pending, confirmed, partial, fulfilled,
              cancelled)
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
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: List of orders
          content:
            application/json:
              schema:
                type: object
                properties:
                  orders:
                    type: array
                    items:
                      type: object
                      properties:
                        orderId:
                          type: string
                        tenantId:
                          type: string
                        status:
                          type: string
                          enum:
                            - pending
                            - confirmed
                            - partial
                            - fulfilled
                            - cancelled
                        orderType:
                          type: string
                          enum:
                            - standard
                            - extension
                            - upgrade
                        customer:
                          type: object
                          properties:
                            customerId:
                              type: string
                              minLength: 1
                            email:
                              type: string
                              format: email
                            firstName:
                              type: string
                              minLength: 1
                            lastName:
                              type: string
                              minLength: 1
                            company:
                              type: string
                            phone:
                              type: string
                            customerType:
                              type: string
                              enum:
                                - individual
                                - business
                              default: individual
                          required:
                            - customerId
                            - email
                            - firstName
                            - lastName
                        billingAddress:
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
                        shippingAddress:
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
                        items:
                          type: array
                          items:
                            type: object
                            properties:
                              productId:
                                type: string
                              productImageUrl:
                                type: string
                                format: uri
                              variantId:
                                type: string
                              sku:
                                type: string
                                minLength: 1
                              productName:
                                type: string
                                minLength: 1
                              quantity:
                                type: integer
                                minimum: 1
                              unitPrice:
                                type: number
                                minimum: 0
                              contractLength:
                                type: number
                              listPrice:
                                type: number
                                minimum: 0
                              listPriceSource:
                                type: string
                                enum:
                                  - variant
                                  - manual
                                  - unknown
                                default: unknown
                              acquisitionCost:
                                type: number
                                minimum: 0
                              acquisitionCostSource:
                                type: string
                                enum:
                                  - variant
                                  - manual
                                  - list_price
                                  - unknown
                                default: unknown
                              listPriceOverride:
                                type: number
                                minimum: 0
                              acquisitionCostOverride:
                                type: number
                                minimum: 0
                              usedListPriceAsAcquisition:
                                type: boolean
                                default: false
                              rentalIds:
                                type: array
                                items:
                                  type: string
                                default: []
                              rentalStatus:
                                type: string
                                enum:
                                  - pending
                                  - partial
                                  - completed
                                default: pending
                            required:
                              - sku
                              - productName
                              - quantity
                              - unitPrice
                              - contractLength
                        totals:
                          type: object
                          properties:
                            subtotal:
                              type: number
                              minimum: 0
                            taxAmount:
                              type: number
                              minimum: 0
                              default: 0
                            total:
                              type: number
                              minimum: 0
                            currency:
                              type: string
                              minLength: 3
                              maxLength: 3
                            totalDevices:
                              type: integer
                              minimum: 1
                          required:
                            - subtotal
                            - total
                            - currency
                            - totalDevices
                        payment:
                          type: object
                          properties:
                            status:
                              type: string
                              enum:
                                - pending
                                - paid
                                - failed
                            method:
                              type: string
                              enum:
                                - stripe
                                - manual
                            transactionId:
                              type: string
                            paidAmount:
                              type: number
                              minimum: 0
                            manuallyMarked:
                              type: boolean
                              default: false
                        customFields:
                          type:
                            - object
                            - 'null'
                          additionalProperties: {}
                        rentalProgress:
                          type: object
                          properties:
                            totalDevices:
                              type: integer
                              minimum: 0
                            rentedDevices:
                              type: integer
                              minimum: 0
                          required:
                            - totalDevices
                            - rentedDevices
                        rentalIds:
                          type: array
                          items:
                            type: string
                        billingGroupId:
                          type: string
                        trackingNumber:
                          type: string
                        shippedAt:
                          type: string
                        createdAt:
                          type: string
                        updatedAt:
                          type: string
                        createdBy:
                          type: string
                        notes:
                          type: string
                        extensionDetails:
                          type: object
                          properties:
                            originalOrderId:
                              type: string
                            extensionMonths:
                              type: integer
                              exclusiveMinimum: 0
                            previousEndDate:
                              type: string
                            newEndDate:
                              type: string
                            reason:
                              type: string
                          required:
                            - originalOrderId
                            - extensionMonths
                            - previousEndDate
                            - newEndDate
                        upgradeDetails:
                          type: object
                          properties:
                            previousDevice:
                              type: string
                            previousSerialNumber:
                              type: string
                            previousMonthlyAmount:
                              type: number
                            previousRentalId:
                              type: string
                            upgradeReason:
                              type: string
                          required:
                            - previousDevice
                            - previousSerialNumber
                            - previousMonthlyAmount
                            - previousRentalId
                      required:
                        - orderId
                        - tenantId
                        - status
                        - orderType
                        - customer
                        - billingAddress
                        - shippingAddress
                        - items
                        - totals
                        - rentalProgress
                        - rentalIds
                        - createdAt
                        - updatedAt
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
                  - orders
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