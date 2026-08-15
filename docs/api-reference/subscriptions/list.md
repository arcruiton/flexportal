> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# List Subscriptions

> Returns a paginated list of subscriptions.

## Overview

Retrieve a paginated list of subscriptions with optional filtering and sorting. Each subscription tracks billing, payments, cost recovery, and the complete lifecycle from activation to completion.

## Subscription Lifecycle

```
Order Created → Subscription Created → Active → [Extension/Upgrade/Buyout/Early Return] → Ended
```

Subscriptions can end through several paths:

* **Contract completed**: Reached end date naturally
* **Buyout**: Customer purchased the device
* **Early return**: Customer returned before contract end
* **Cancellation**: Terminated by operator

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Active Subscriptions Dashboard" icon="chart-line">
    Monitor active subscriptions, MRR, and contract renewals
  </Card>

  <Card title="Operations Management" icon="clipboard-list">
    Track devices in the field, upcoming end dates, and required actions
  </Card>

  <Card title="Customer Support" icon="headset">
    Look up customer subscriptions during support inquiries
  </Card>

  <Card title="Financial Reporting" icon="file-invoice-dollar">
    Generate reports on revenue, cost recovery, and profitability
  </Card>
</CardGroup>

## Filtering Subscriptions

```bash theme={null}
# Get all active subscriptions
GET /v1/subscriptions?status=active

# Get subscriptions for a customer
GET /v1/subscriptions?customerId=cust_abc123

# Get subscriptions ending this month
GET /v1/subscriptions?endDateFrom=2025-01-01&endDateTo=2025-01-31

# Get subscriptions by product SKU
GET /v1/subscriptions?sku=MACBOOK-PRO-16-M3

# Get subscriptions with specific asset
GET /v1/subscriptions?serialNumber=SN123456789
```

## Subscription Status Values

| Status               | Description                       |
| -------------------- | --------------------------------- |
| `active`             | Currently active subscription     |
| `ended_completed`    | Contract completed naturally      |
| `ended_buyout`       | Customer purchased the device     |
| `ended_upgrade`      | Customer upgraded to a new device |
| `ended_early_return` | Customer returned early           |
| `cancelled`          | Subscription was cancelled        |

## Response Fields

Key fields in each subscription object:

| Field            | Description                    |
| ---------------- | ------------------------------ |
| `subscriptionId` | Unique subscription identifier |
| `status`         | Current subscription status    |
| `customerId`     | Associated customer ID         |
| `orderId`        | Original order ID              |
| `sku`            | Product variant SKU            |
| `productName`    | Product display name           |
| `serialNumber`   | Assigned asset serial number   |
| `startDate`      | Subscription start date        |
| `endDate`        | Subscription end date          |
| `contractLength` | Duration in months             |
| `monthlyAmount`  | Monthly billing amount         |
| `costRecovery`   | Cost recovery metrics          |
| `createdAt`      | ISO 8601 timestamp             |

## Cost Recovery Metrics

Each subscription includes profitability data:

```json theme={null}
{
  "costRecovery": {
    "acquisitionCost": 1800.00,
    "totalCollected": 1548.00,
    "costRecoveryPercent": 86.0,
    "breakevenMonth": 14,
    "monthsRemaining": 10
  }
}
```

## Example: Find Subscriptions Ending Soon

```javascript theme={null}
// Get subscriptions ending in the next 30 days
const today = new Date();
const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

const { subscriptions } = await listSubscriptions({
  status: 'active',
  endDateFrom: today.toISOString().split('T')[0],
  endDateTo: thirtyDays.toISOString().split('T')[0],
  sortBy: 'endDate',
  sortDir: 'asc'
});

// These customers might be interested in extensions or upgrades
for (const sub of subscriptions) {
  console.log(`${sub.productName} (${sub.customerId}) ends ${sub.endDate}`);
}
```

## Related Endpoints

* [Get Subscription](/api-reference/subscriptions/get) - Get detailed subscription info
* [Create Subscription](/api-reference/subscriptions/create) - Create subscription from order
* [Extend Subscription](/api-reference/subscriptions/extend) - Extend contract period
* [Buyout Subscription](/api-reference/subscriptions/buyout) - Convert to purchase


## OpenAPI

````yaml GET /v1/subscriptions
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
  /v1/subscriptions:
    get:
      tags:
        - Subscriptions
      summary: List subscriptions
      description: Returns a paginated list of subscriptions.
      operationId: listSubscriptions
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
              Filter by status (active, cancelled, ended_completed,
              ended_buyout, ended_upgrade, ended_early_return)
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
            description: Filter by order ID
          required: false
          name: orderId
          in: query
        - schema:
            type: string
            description: Filter by asset serial number
          required: false
          name: serialNumber
          in: query
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: List of subscriptions
          content:
            application/json:
              schema:
                type: object
                properties:
                  rentals:
                    type: array
                    items:
                      type: object
                      properties:
                        rentalId:
                          type: string
                        tenantId:
                          type: string
                        assetSerialNumber:
                          type: string
                        customerId:
                          type: string
                        productId:
                          type: string
                        variantId:
                          type: string
                        sku:
                          type: string
                        productName:
                          type: string
                        productImageUrl:
                          type: string
                        monthlyAmount:
                          type: number
                        currency:
                          type: string
                        status:
                          type: string
                          enum:
                            - active
                            - cancelled
                            - ended_completed
                            - ended_buyout
                            - ended_upgrade
                            - ended_early_return
                        billingGroupId:
                          type: string
                        originalContractLength:
                          type: number
                        contractLength:
                          type: number
                        startDate:
                          type: string
                        endDate:
                          type: string
                        nextBillingDate:
                          type: string
                        lastModifiedDate:
                          type: string
                        extensionHistory:
                          type: array
                          items:
                            type: object
                            properties:
                              extensionMonths:
                                type: integer
                                minimum: 0
                                maximum: 120
                              oldContractLength:
                                type: integer
                                exclusiveMinimum: 0
                                minimum: 1
                                maximum: 120
                              newContractLength:
                                type: integer
                                exclusiveMinimum: 0
                                minimum: 1
                                maximum: 120
                              oldMonthlyAmount:
                                type: number
                                minimum: 0
                              newMonthlyAmount:
                                type: number
                                minimum: 0
                              reason:
                                type: string
                              notes:
                                type: string
                              extendedBy:
                                type: object
                                properties:
                                  userId:
                                    type: string
                                  email:
                                    type: string
                                  displayName:
                                    type: string
                                  role:
                                    type: string
                                  memberId:
                                    type: string
                                required:
                                  - userId
                              oldEndDate:
                                type: string
                              newEndDate:
                                type: string
                              extendedAt:
                                type: string
                            required:
                              - extensionMonths
                              - oldContractLength
                              - newContractLength
                              - oldMonthlyAmount
                              - newMonthlyAmount
                              - extendedBy
                              - oldEndDate
                              - newEndDate
                              - extendedAt
                        actualMonthsRented:
                          type: number
                        monthsSaved:
                          type: number
                        listPrice:
                          type: number
                        listPriceSource:
                          type: string
                          enum:
                            - variant
                            - manual
                            - order_override
                            - estimated
                            - unknown
                        listPriceCapturedAt:
                          type: string
                        acquisitionCost:
                          type: number
                        acquisitionCostSource:
                          type: string
                          enum:
                            - variant
                            - manual
                            - order_override
                            - list_price
                            - unknown
                        acquisitionCostCapturedAt:
                          type: string
                        totalCollected:
                          type: number
                        costRecoveryPercent:
                          type: number
                        currentProfit:
                          type: number
                        breakevenMonths:
                          type: number
                        hasReachedBreakeven:
                          type: boolean
                        recoveryStatus:
                          type: string
                          enum:
                            - profitable
                            - recovering
                            - at_risk
                            - no_data
                        replacementHistory:
                          type: array
                          items:
                            type: object
                            properties:
                              oldSerialNumber:
                                type: string
                              newSerialNumber:
                                type: string
                              reason:
                                type: string
                              damageAssessment:
                                type: string
                              insuranceClaim:
                                type: boolean
                              notes:
                                type: string
                              replacedBy:
                                type: object
                                properties:
                                  userId:
                                    type: string
                                  email:
                                    type: string
                                  displayName:
                                    type: string
                                  role:
                                    type: string
                                  memberId:
                                    type: string
                                required:
                                  - userId
                              replacedAt:
                                type: string
                            required:
                              - oldSerialNumber
                              - newSerialNumber
                              - reason
                              - replacedBy
                              - replacedAt
                        buyoutDetails:
                          type: object
                          properties:
                            buyoutPrice:
                              type: number
                              minimum: 0
                            calculationMethod:
                              type: string
                              enum:
                                - auto_calculated
                                - manual_override
                            calculationBreakdown:
                              type: object
                              properties:
                                remainingMonths:
                                  type: integer
                                  minimum: 0
                                  maximum: 120
                                remainingMonthsPayment:
                                  type: number
                                  minimum: 0
                                listPricePercentage:
                                  type: number
                                listPriceAmount:
                                  type: number
                                  minimum: 0
                                flatFee:
                                  type: number
                                  minimum: 0
                              required:
                                - remainingMonths
                                - remainingMonthsPayment
                                - listPricePercentage
                                - listPriceAmount
                                - flatFee
                            reason:
                              type: string
                              enum:
                                - customer_request
                                - end_of_contract
                                - other
                            notes:
                              type: string
                            processedBy:
                              type: object
                              properties:
                                userId:
                                  type: string
                                email:
                                  type: string
                                displayName:
                                  type: string
                                role:
                                  type: string
                                memberId:
                                  type: string
                              required:
                                - userId
                            buyoutDate:
                              type: string
                          required:
                            - buyoutPrice
                            - calculationMethod
                            - reason
                            - processedBy
                            - buyoutDate
                        earlyReturnDetails:
                          type: object
                          properties:
                            fee:
                              type: number
                              minimum: 0
                            feeWaived:
                              type: boolean
                            calculationMethod:
                              type: string
                              enum:
                                - auto_calculated
                                - manual_override
                            calculationBreakdown:
                              type: object
                              properties:
                                method:
                                  type: string
                                  enum:
                                    - remaining_months
                                    - flat_fee
                                    - no_fee
                                    - manual
                                remainingMonths:
                                  type: integer
                                  minimum: 0
                                  maximum: 120
                                gracePeriodApplied:
                                  type: boolean
                                daysFromStart:
                                  type: integer
                                  minimum: 0
                                  maximum: 3650
                              required:
                                - method
                                - remainingMonths
                                - gracePeriodApplied
                                - daysFromStart
                            returnCondition:
                              type: string
                              enum:
                                - excellent
                                - good
                                - fair
                                - poor
                                - damaged
                            reason:
                              type: string
                              minLength: 1
                            damageAssessment:
                              type: string
                            notes:
                              type: string
                            processedBy:
                              type: object
                              properties:
                                userId:
                                  type: string
                                email:
                                  type: string
                                displayName:
                                  type: string
                                role:
                                  type: string
                                memberId:
                                  type: string
                              required:
                                - userId
                            returnedAt:
                              type: string
                          required:
                            - fee
                            - feeWaived
                            - calculationMethod
                            - returnCondition
                            - reason
                            - processedBy
                            - returnedAt
                        cancellationDetails:
                          type: object
                          properties:
                            reason:
                              type: string
                              enum:
                                - customer_request
                                - payment_failure
                                - fraud
                                - admin_decision
                                - other
                            notes:
                              type: string
                            processedBy:
                              type: object
                              properties:
                                userId:
                                  type: string
                                email:
                                  type: string
                                displayName:
                                  type: string
                                role:
                                  type: string
                                memberId:
                                  type: string
                              required:
                                - userId
                            cancelledAt:
                              type: string
                          required:
                            - reason
                            - processedBy
                            - cancelledAt
                        orderId:
                          type: string
                        upgradeFromRentalId:
                          type: string
                        customerEmail:
                          type: string
                        customerName:
                          type: string
                        customFields:
                          type: object
                          additionalProperties: {}
                        createdAt:
                          type: string
                        updatedAt:
                          type: string
                        createdBy:
                          type: string
                        notes:
                          type: string
                      required:
                        - rentalId
                        - tenantId
                        - assetSerialNumber
                        - customerId
                        - sku
                        - productName
                        - monthlyAmount
                        - currency
                        - status
                        - originalContractLength
                        - contractLength
                        - startDate
                        - orderId
                        - customerEmail
                        - customerName
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
                  - rentals
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