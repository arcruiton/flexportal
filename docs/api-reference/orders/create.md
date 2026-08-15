> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Create Order

> Creates a new subscription order for a customer. The order goes through validation, pricing calculation, and customer lookup/creation. If no customer exists with the provided email, one is automatically created.

## Overview

Create a new subscription order for a customer. Orders capture the customer's intent to subscribe to products—they don't immediately create active subscriptions. After an order is created and confirmed, you'll use the [Create Subscription](/api-reference/subscriptions/create) endpoint to fulfill order items.

<Info>
  Orders are the starting point for the subscription lifecycle. Think of them as "checkout transactions" that need to be fulfilled by creating subscriptions and assigning assets.
</Info>

## Order Types

| Type        | Description                      | When to use                               |
| ----------- | -------------------------------- | ----------------------------------------- |
| `standard`  | New subscription order           | Default for new customers or new products |
| `extension` | Extend an existing subscription  | Customer wants to keep device longer      |
| `upgrade`   | Replace with a different product | Customer wants a better/different device  |

## Common Use Cases

<CardGroup cols={2}>
  <Card title="E-commerce Integration" icon="cart-shopping">
    Create orders from your checkout flow when customers complete a subscription purchase
  </Card>

  <Card title="Sales Tool" icon="handshake">
    Build internal tools for sales teams to create orders during customer calls
  </Card>

  <Card title="B2B Portal" icon="building">
    Let business customers place bulk orders through a self-service portal
  </Card>

  <Card title="Migration" icon="database">
    Import historical orders when migrating from another subscription platform
  </Card>
</CardGroup>

## Minimal Request Example

The simplest order needs customer info, billing address, and at least one item:

```json theme={null}
{
  "customer": {
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Smith"
  },
  "billingAddress": {
    "contactName": "John Smith",
    "streetAddress": "123 Main Street",
    "city": "Amsterdam",
    "country": "Netherlands"
  },
  "items": [
    {
      "sku": "MACBOOK-PRO-16-M3",
      "quantity": 1
    }
  ]
}
```

<Tip>
  The `sku` must match an active product variant in your catalog. The system automatically looks up pricing based on the variant's configured rates.
</Tip>

## Complete Request Example

For business customers with full details:

```json theme={null}
{
  "orderType": "standard",
  "customer": {
    "email": "procurement@acmecorp.com",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "company": "Acme Corporation",
    "phone": "+31612345678",
    "customerType": "business"
  },
  "billingAddress": {
    "contactName": "Finance Department",
    "company": "Acme Corporation",
    "streetAddress": "456 Business Park",
    "buildingInfo": "Building A, 3rd Floor",
    "city": "Rotterdam",
    "postalCode": "3011 AA",
    "country": "Netherlands"
  },
  "shippingAddress": {
    "contactName": "Sarah Johnson",
    "company": "Acme Corporation",
    "streetAddress": "789 Office Plaza",
    "city": "Amsterdam",
    "postalCode": "1012 AB",
    "country": "Netherlands"
  },
  "items": [
    {
      "sku": "MACBOOK-PRO-16-M3",
      "quantity": 5,
      "contractLength": 24
    },
    {
      "sku": "IPAD-PRO-12-M2",
      "quantity": 3,
      "contractLength": 12
    }
  ],
  "customFields": {
    "purchaseOrderNumber": "PO-2025-001234",
    "costCenter": "IT-DEV-001"
  },
  "notes": "Rush delivery requested - new employee onboarding"
}
```

## Customer Handling

When you create an order:

1. **Existing customer** (matching email): Order is linked to existing customer record
2. **New customer**: A new customer record is created automatically

The customer's `customerId` is returned in the order response and can be used for future orders.

## Address Fields

Both `billingAddress` and `shippingAddress` support these fields:

| Field           | Required | Description                           |
| --------------- | -------- | ------------------------------------- |
| `contactName`   | Yes      | Person to contact at this address     |
| `streetAddress` | Yes      | Street name and number                |
| `city`          | Yes      | City name                             |
| `country`       | Yes      | Country name                          |
| `company`       | No       | Company name (for business addresses) |
| `buildingInfo`  | No       | Building, floor, suite details        |
| `locality`      | No       | Neighborhood or district              |
| `adminArea`     | No       | State, province, or region            |
| `postalCode`    | No       | ZIP or postal code                    |

<Warning>
  If `shippingAddress` is not provided, the `billingAddress` will be used for shipping.
</Warning>

## Custom Fields

Use `customFields` to store additional data specific to your business:

```json theme={null}
{
  "customFields": {
    "purchaseOrderNumber": "PO-2025-001234",
    "siebelId": "ACC-789456",
    "salesRep": "jane.doe@company.com",
    "department": "Engineering"
  }
}
```

Custom fields can be used for:

* Purchase order numbers
* CRM/ERP reference IDs
* Cost centers or department codes
* Sales attribution

<Tip>
  Configure custom fields in Dashboard → Settings to make them searchable and filterable.
</Tip>

## What Happens Next

After creating an order:

1. **Order created** with `pending` status
2. **Review** the order (manual or automated)
3. **Confirm** the order (updates to `confirmed` status)
4. **Create subscriptions** for each item using [Create Subscription](/api-reference/subscriptions/create)
5. **Order fulfilled** when all items have active subscriptions

## Error Handling

| Error Code                | Cause                         | Solution                                            |
| ------------------------- | ----------------------------- | --------------------------------------------------- |
| `VALIDATION_ERROR`        | Missing required fields       | Check `details` for specific field errors           |
| `VARIANT_NOT_FOUND`       | SKU doesn't exist             | Verify SKU against your product catalog             |
| `VARIANT_INACTIVE`        | SKU exists but is deactivated | Reactivate variant or use different SKU             |
| `INVALID_CONTRACT_LENGTH` | Unsupported contract duration | Use a configured contract length (e.g., 12, 24, 36) |

## Related Endpoints

* [List Orders](/api-reference/orders/list) - View all orders
* [Get Order](/api-reference/orders/get) - Get order details
* [Create Subscription](/api-reference/subscriptions/create) - Fulfill order items
* [List Products](/api-reference/products/list) - Find valid SKUs


## OpenAPI

````yaml POST /v1/orders
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
    post:
      tags:
        - Orders
      summary: Create an order
      description: >-
        Creates a new subscription order for a customer. The order goes through
        validation, pricing calculation, and customer lookup/creation. If no
        customer exists with the provided email, one is automatically created.
      operationId: createOrder
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
                orderType:
                  type: string
                  enum:
                    - standard
                    - extension
                    - upgrade
                  default: standard
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
                customer:
                  type: object
                  properties:
                    email:
                      type: string
                      format: email
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
                      default: individual
                  required:
                    - email
                    - firstName
                    - lastName
                customFields:
                  type:
                    - object
                    - 'null'
                  additionalProperties: {}
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
                      sku:
                        type: string
                        minLength: 1
                      quantity:
                        type: integer
                        minimum: 1
                      contractLength:
                        type: number
                    required:
                      - sku
                      - quantity
                  minItems: 1
                notes:
                  type: string
              required:
                - customer
                - billingAddress
                - items
            example:
              orderType: standard
              customer:
                email: sarah.johnson@acmecorp.com
                firstName: Sarah
                lastName: Johnson
                company: Acme Corporation
                phone: +1-555-123-4567
                customerType: business
              billingAddress:
                contactName: Sarah Johnson
                company: Acme Corporation
                streetAddress: 123 Business Park Drive
                city: San Francisco
                adminArea: CA
                postalCode: '94105'
                country: US
              shippingAddress:
                contactName: Sarah Johnson
                company: Acme Corporation
                streetAddress: 123 Business Park Drive
                city: San Francisco
                adminArea: CA
                postalCode: '94105'
                country: US
              items:
                - sku: MACBOOK-PRO-16-M3
                  quantity: 5
                  contractLength: 24
                - sku: DELL-U2722D-MONITOR
                  quantity: 5
                  contractLength: 24
              notes: IT department refresh - Q1 2025
      responses:
        '201':
          description: Order created successfully
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
                  orderId:
                    type: string
                  order:
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
                required:
                  - success
                  - message
                  - orderId
                  - order
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