> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Update Customer

> Updates customer details such as name, phone, or addresses.

## Overview

Update a customer's profile information, contact details, or addresses. Use this endpoint to keep customer data current or to correct information after initial order creation.

## Common Use Cases

* **Profile Updates**: Customer changed their phone number or email
* **Company Changes**: Customer switched jobs or company renamed
* **Address Updates**: Customer moved to a new location
* **Data Correction**: Fix typos or errors from initial order entry
* **CRM Sync**: Update customer data from external systems

## Updatable Fields

| Field             | Description                |
| ----------------- | -------------------------- |
| `email`           | Customer email address     |
| `firstName`       | First name                 |
| `lastName`        | Last name                  |
| `company`         | Company name               |
| `phone`           | Phone number               |
| `customerType`    | `individual` or `business` |
| `billingAddress`  | Billing address object     |
| `shippingAddress` | Shipping address object    |

## Partial Updates

Only include fields you want to change:

```json theme={null}
{
  "phone": "+31612345678",
  "company": "New Company Name"
}
```

## Updating Addresses

Update billing or shipping addresses:

```json theme={null}
{
  "billingAddress": {
    "contactName": "Finance Department",
    "company": "Acme Corporation",
    "streetAddress": "789 New Street",
    "city": "Utrecht",
    "postalCode": "3500 AA",
    "country": "Netherlands"
  }
}
```

Address fields:

| Field           | Required | Description                    |
| --------------- | -------- | ------------------------------ |
| `contactName`   | Yes      | Contact person at this address |
| `streetAddress` | Yes      | Street name and number         |
| `city`          | Yes      | City name                      |
| `country`       | Yes      | Country name                   |
| `company`       | No       | Company name                   |
| `buildingInfo`  | No       | Building, floor, suite         |
| `locality`      | No       | Neighborhood or district       |
| `adminArea`     | No       | State or province              |
| `postalCode`    | No       | ZIP or postal code             |

## Example: Update Contact Information

```javascript theme={null}
await updateCustomer('cust_abc123', {
  phone: '+31687654321',
  email: 'newemail@company.com'
});
```

## Example: Update for Company Merger

```javascript theme={null}
// Customer's company was acquired
await updateCustomer('cust_abc123', {
  company: 'Acquiring Company B.V.',
  billingAddress: {
    contactName: 'Finance Department',
    company: 'Acquiring Company B.V.',
    streetAddress: '100 Corporate Plaza',
    city: 'Amsterdam',
    postalCode: '1000 AA',
    country: 'Netherlands'
  }
});
```

## Changing Customer Type

Convert between individual and business:

```json theme={null}
{
  "customerType": "business",
  "company": "New Business LLC"
}
```

<Info>
  Changing customer type to `business` enables features like billing groups for consolidated invoicing.
</Info>

## Impact on Existing Data

| Change  | Impact                                                                           |
| ------- | -------------------------------------------------------------------------------- |
| Email   | Updates customer record; orders retain original email at time of order           |
| Address | Updates customer record; existing orders/subscriptions retain original addresses |
| Company | Updates display name; historical records unchanged                               |

<Warning>
  Updates only affect the customer profile. Existing orders and subscriptions retain the information captured at the time of creation.
</Warning>

## Related Endpoints

* [Get Customer](/api-reference/customers/get) - View current customer details
* [Delete Customer](/api-reference/customers/delete) - Deactivate customer
* [List Orders](/api-reference/orders/list) - View customer's orders


## OpenAPI

````yaml PUT /v1/customers/{customerId}
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
    put:
      tags:
        - Customers
      summary: Update a customer
      description: Updates customer details such as name, phone, or addresses.
      operationId: updateCustomer
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
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                customerId:
                  type: string
                  minLength: 1
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
                status:
                  type: string
                  enum:
                    - active
                    - inactive
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
              required:
                - customerId
      responses:
        '200':
          description: Customer updated
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
                  customer:
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
                required:
                  - success
                  - message
                  - customerId
                  - customer
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