> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Get Subscription

> Retrieves a specific subscription by ID.

## Overview

Retrieve complete details for a single subscription, including full cost recovery metrics, lifecycle history, and payment information. This endpoint returns the most comprehensive view of a subscription.

## Common Use Cases

* **Subscription Detail Page**: Display complete subscription information
* **Cost Recovery Analysis**: Review profitability and breakeven analysis
* **Lifecycle Tracking**: View extension, upgrade, and replacement history
* **Support Inquiries**: Get full context during customer support

## Cost Recovery Details

The response includes detailed profitability metrics:

```json theme={null}
{
  "costRecovery": {
    "acquisitionCost": 1800.00,
    "listPrice": 2499.00,
    "totalCollected": 1548.00,
    "costRecoveryPercent": 86.0,
    "breakevenMonth": 14,
    "monthsActive": 12,
    "monthsRemaining": 12,
    "projectedTotalCollection": 3096.00,
    "projectedMargin": 1296.00,
    "projectedMarginPercent": 72.0
  }
}
```

| Metric                     | Description                             |
| -------------------------- | --------------------------------------- |
| `acquisitionCost`          | What you paid for the asset             |
| `listPrice`                | MSRP/retail price                       |
| `totalCollected`           | Total payments collected so far         |
| `costRecoveryPercent`      | (Collected / Cost) × 100                |
| `breakevenMonth`           | Month when cost will be fully recovered |
| `monthsActive`             | How long subscription has been active   |
| `monthsRemaining`          | Months until contract ends              |
| `projectedTotalCollection` | Expected total at contract end          |
| `projectedMargin`          | Expected profit at contract end         |

## Lifecycle History

Subscriptions track all lifecycle events:

```json theme={null}
{
  "extensionHistory": [
    {
      "extendedAt": "2025-06-15T10:30:00Z",
      "extensionMonths": 6,
      "previousEndDate": "2025-06-30",
      "newEndDate": "2025-12-31",
      "reason": "Customer requested extension"
    }
  ],
  "replacementHistory": [
    {
      "replacedAt": "2025-03-10T14:00:00Z",
      "previousSerialNumber": "SN123456",
      "newSerialNumber": "SN789012",
      "reason": "Device malfunction"
    }
  ]
}
```

## Subscription Details

Key fields in the response:

| Field             | Description                       |
| ----------------- | --------------------------------- |
| `subscriptionId`  | Unique identifier                 |
| `status`          | Current status                    |
| `customerId`      | Customer ID                       |
| `orderId`         | Original order ID                 |
| `sku`             | Product variant SKU               |
| `productName`     | Product display name              |
| `serialNumber`    | Current asset serial number       |
| `startDate`       | Contract start date               |
| `endDate`         | Contract end date                 |
| `contractLength`  | Duration in months                |
| `monthlyAmount`   | Monthly billing amount            |
| `nextBillingDate` | Next scheduled payment date       |
| `billingGroupId`  | B2B billing group (if applicable) |

## Example: Display Subscription Summary

```javascript theme={null}
async function getSubscriptionSummary(subscriptionId) {
  const sub = await getSubscription(subscriptionId);

  const isProfitable = sub.costRecovery.costRecoveryPercent >= 100;
  const monthsToBreakeven = sub.costRecovery.breakevenMonth - sub.costRecovery.monthsActive;

  return {
    product: sub.productName,
    customer: sub.customerId,
    status: sub.status,
    monthlyPayment: `€${sub.monthlyAmount}`,
    contractPeriod: `${sub.startDate} to ${sub.endDate}`,
    costRecovery: `${sub.costRecovery.costRecoveryPercent.toFixed(1)}%`,
    isProfitable,
    monthsToBreakeven: isProfitable ? 0 : monthsToBreakeven,
    extensions: sub.extensionHistory?.length || 0,
    replacements: sub.replacementHistory?.length || 0
  };
}
```

## Related Endpoints

* [List Subscriptions](/api-reference/subscriptions/list) - Browse all subscriptions
* [Extend Subscription](/api-reference/subscriptions/extend) - Extend the contract
* [Upgrade Subscription](/api-reference/subscriptions/upgrade) - Upgrade to new device
* [Buyout Subscription](/api-reference/subscriptions/buyout) - Convert to purchase
* [Calculate Buyout](/api-reference/subscriptions/calculate-buyout) - Get buyout price


## OpenAPI

````yaml GET /v1/subscriptions/{subscriptionId}
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
  /v1/subscriptions/{subscriptionId}:
    get:
      tags:
        - Subscriptions
      summary: Get a subscription
      description: Retrieves a specific subscription by ID.
      operationId: getSubscription
      parameters:
        - schema:
            type: string
            description: The subscription ID
          required: true
          name: subscriptionId
          in: path
        - schema:
            type: string
            description: Your tenant identifier
          required: true
          name: Tenant-ID
          in: header
      responses:
        '200':
          description: Subscription details
          content:
            application/json:
              schema:
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
        '404':
          description: Subscription not found
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