> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Order

> Retrieves a specific order by ID.

## Overview

Retrieve complete details for a single order by its ID. Use this endpoint to display order details, check fulfillment status, or verify order contents before creating subscriptions.

## Common Use Cases

* **Order Details Page**: Display complete order information to customers or staff
* **Pre-Fulfillment Check**: Verify order contents and customer details before creating subscriptions
* **Status Tracking**: Check if an order has been fully fulfilled
* **Invoice Generation**: Get order totals and line items for invoicing

## Order Lifecycle

Orders progress through these statuses:

```
pending → confirmed → partial → fulfilled
                  ↘     ↗
                 cancelled
```

| Status      | What it means                                               |
| ----------- | ----------------------------------------------------------- |
| `pending`   | Order received, awaiting review/confirmation                |
| `confirmed` | Approved and ready for fulfillment (creating subscriptions) |
| `partial`   | Some items have subscriptions, others still pending         |
| `fulfilled` | All items have active subscriptions                         |
| `cancelled` | Order was cancelled (no subscriptions created)              |

## Understanding Order Items

Each item in the `items` array represents a product line in the order:

```json theme={null}
{
  "sku": "MACBOOK-PRO-16-M3",
  "productName": "MacBook Pro 16\" M3",
  "quantity": 3,
  "unitPrice": 89.00,
  "contractLength": 24,
  "rentalStatus": "partial",
  "rentalIds": ["sub_abc123", "sub_def456"]
}
```

| Field            | Description                                     |
| ---------------- | ----------------------------------------------- |
| `sku`            | Product variant SKU                             |
| `quantity`       | Number of units ordered                         |
| `unitPrice`      | Monthly subscription price per unit             |
| `contractLength` | Subscription duration in months                 |
| `rentalStatus`   | `pending`, `partial`, or `completed`            |
| `rentalIds`      | IDs of subscriptions created for this line item |

## Fulfillment Progress

The `rentalProgress` field shows overall fulfillment status:

```json theme={null}
{
  "rentalProgress": {
    "totalDevices": 5,
    "rentedDevices": 3
  }
}
```

When `rentedDevices` equals `totalDevices`, the order status changes to `fulfilled`.

## Cost Tracking Fields

For cost recovery and profitability tracking:

| Field                   | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `listPrice`             | MSRP/retail price of the product                         |
| `acquisitionCost`       | Your cost to acquire the product                         |
| `listPriceSource`       | Where list price came from (`variant`, `manual`)         |
| `acquisitionCostSource` | Where cost came from (`variant`, `manual`, `list_price`) |

## Example: Check if Order is Ready for Fulfillment

```javascript theme={null}
const order = await getOrder('ord_abc123');

if (order.status === 'confirmed') {
  // Order is approved, check for unfulfilled items
  const unfulfilledItems = order.items.filter(
    item => item.rentalStatus !== 'completed'
  );

  for (const item of unfulfilledItems) {
    const unitsNeeded = item.quantity - item.rentalIds.length;
    console.log(`Need ${unitsNeeded}x ${item.sku}`);
  }
}
```

## Related Endpoints

* [List Orders](/api-reference/orders/list) - Get all orders with filtering
* [Create Subscription](/api-reference/subscriptions/create) - Create subscriptions for order items
* [Get Customer](/api-reference/customers/get) - Get customer details


## OpenAPI

````yaml GET /v1/orders/{orderId}
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
  /v1/orders/{orderId}:
    get:
      tags:
        - Orders
      summary: Get an order
      description: Retrieves a specific order by ID.
      operationId: getOrder
      parameters:
        - schema:
            type: string
            description: The order ID
          required: true
          name: orderId
          in: path
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: Order details
          content:
            application/json:
              schema:
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
        '404':
          description: Order not found
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