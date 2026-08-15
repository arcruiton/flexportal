> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Export Subscriptions

> Exports rental/subscription data to CSV format with optional date range and field filtering.

## Overview

Export subscription data to CSV format. Use this for reporting, data analysis, or importing into external systems like spreadsheets or business intelligence tools.

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Financial Reporting" icon="chart-pie">
    Export data for revenue analysis and forecasting
  </Card>

  <Card title="Accounting Integration" icon="calculator">
    Import subscription data into accounting software
  </Card>

  <Card title="Business Intelligence" icon="chart-line">
    Feed data into BI tools for advanced analytics
  </Card>

  <Card title="Compliance Audits" icon="clipboard-check">
    Generate reports for audit and compliance needs
  </Card>
</CardGroup>

## Request Fields

| Field           | Required | Description                               |
| --------------- | -------- | ----------------------------------------- |
| `status`        | No       | Filter by status: `active`, `ended`, etc. |
| `startDateFrom` | No       | Filter by start date (from)               |
| `startDateTo`   | No       | Filter by start date (to)                 |
| `endDateFrom`   | No       | Filter by end date (from)                 |
| `endDateTo`     | No       | Filter by end date (to)                   |
| `customerId`    | No       | Filter by customer                        |

## Example: Export All Active Subscriptions

```json theme={null}
{
  "status": "active"
}
```

## Example: Export by Date Range

```json theme={null}
{
  "startDateFrom": "2024-01-01",
  "startDateTo": "2024-12-31"
}
```

## Response

The response includes a download URL for the CSV file:

```json theme={null}
{
  "success": true,
  "downloadUrl": "https://storage.example.com/exports/rentals-2025-01-15.csv?signature=...",
  "expiresAt": "2025-01-15T12:00:00Z",
  "recordCount": 1250
}
```

## CSV Columns

The exported CSV includes:

| Column                | Description                |
| --------------------- | -------------------------- |
| `subscriptionId`      | Subscription ID            |
| `customerId`          | Customer ID                |
| `customerEmail`       | Customer email             |
| `customerName`        | Customer full name         |
| `company`             | Company name (if business) |
| `sku`                 | Product SKU                |
| `productName`         | Product name               |
| `serialNumber`        | Asset serial number        |
| `status`              | Subscription status        |
| `startDate`           | Contract start date        |
| `endDate`             | Contract end date          |
| `contractLength`      | Duration in months         |
| `monthlyAmount`       | Monthly payment            |
| `currency`            | Currency code              |
| `totalCollected`      | Total payments collected   |
| `acquisitionCost`     | Asset acquisition cost     |
| `costRecoveryPercent` | Cost recovery percentage   |

## Example: Monthly Revenue Report

```javascript theme={null}
async function generateMonthlyReport(year, month) {
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const { downloadUrl, recordCount } = await exportSubscriptions({
    status: 'active',
    startDateFrom: startDate,
    startDateTo: endDate
  });

  return {
    period: `${year}-${month}`,
    subscriptions: recordCount,
    downloadUrl
  };
}
```

## Example: Customer Data Export

```javascript theme={null}
async function exportCustomerData(customerId) {
  const { downloadUrl, recordCount } = await exportSubscriptions({
    customerId
  });

  return {
    customerId,
    totalSubscriptions: recordCount,
    downloadUrl
  };
}
```

## URL Expiration

Download URLs expire after a short period (typically 15-60 minutes). Download the file promptly after generation.

## Large Exports

For very large exports:

* Consider filtering by date range to reduce size
* Export in batches by customer or time period
* Monitor the `recordCount` to estimate file size

## Related Endpoints

* [List Subscriptions](/api-reference/subscriptions/list) - Query subscriptions via API
* [Get Subscription](/api-reference/subscriptions/get) - Get individual subscription details
* [List Customers](/api-reference/customers/list) - Get customer data


## OpenAPI

````yaml POST /v1/exports/rentals
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
  /v1/exports/rentals:
    post:
      tags:
        - Exports
      summary: Export rentals to CSV
      description: >-
        Exports rental/subscription data to CSV format with optional date range
        and field filtering.
      operationId: exportRentals
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
                startDate:
                  type: string
                  format: date-time
                endDate:
                  type: string
                  format: date-time
                format:
                  type: string
                  enum:
                    - csv
                  default: csv
                includeFields:
                  type: object
                  properties:
                    customerDetails:
                      type: boolean
                      default: true
                    deviceDetails:
                      type: boolean
                      default: true
                    financialDetails:
                      type: boolean
                      default: true
                    customFields:
                      type: boolean
                      default: true
                status:
                  type: string
                  enum:
                    - active
                    - cancelled
                    - ended_completed
                    - ended_buyout
                    - ended_upgrade
                    - ended_early_return
                customerIds:
                  type: array
                  items:
                    type: string
      responses:
        '200':
          description: Export generated
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  filename:
                    type: string
                  csvData:
                    type: string
                  totalRecords:
                    type: number
                  generatedAt:
                    type: string
                  filters:
                    type: object
                    additionalProperties: {}
                  totalRentals:
                    type: number
                  activeRentals:
                    type: number
                  totalRevenue:
                    type: number
                  averageMonthlyRevenue:
                    type: number
                required:
                  - success
                  - filename
                  - csvData
                  - totalRecords
                  - generatedAt
                  - filters
                  - totalRentals
                  - activeRentals
                  - totalRevenue
                  - averageMonthlyRevenue
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