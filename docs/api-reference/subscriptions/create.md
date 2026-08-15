> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Create Subscription

> Creates a new subscription by assigning a specific asset (device) to a customer from an order. This is the order fulfillment step - it links a physical device (by serial number) to a line item in an order, creating an active subscription.

## Overview

Create a new subscription to fulfill an order item. This is the key step that activates a customer's subscription—it assigns a physical asset (by serial number) to an order line item and starts the billing cycle.

<Warning>
  You must have a confirmed order before creating subscriptions. Subscriptions are created for each unit in an order—a line item with quantity 3 requires 3 separate subscription create calls.
</Warning>

## The Fulfillment Flow

```
1. Order created (status: pending)
2. Order confirmed (status: confirmed)
3. Create subscription for each item ← This endpoint
4. Order fulfilled (status: fulfilled) when all items have subscriptions
```

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Order Fulfillment" icon="truck">
    Activate subscriptions as devices are shipped to customers
  </Card>

  <Card title="Warehouse Integration" icon="warehouse">
    Automatically create subscriptions when assets are scanned for shipping
  </Card>

  <Card title="Bulk Activation" icon="boxes-stacked">
    Fulfill multiple-unit orders by creating subscriptions for each item
  </Card>

  <Card title="Migration" icon="database">
    Import existing subscriptions when migrating from another platform
  </Card>
</CardGroup>

## Request Fields

| Field               | Required | Description                                              |
| ------------------- | -------- | -------------------------------------------------------- |
| `orderId`           | Yes      | The order to fulfill                                     |
| `assetSerialNumber` | Yes      | Serial number of the asset to assign                     |
| `customerId`        | Yes      | Customer ID for this subscription                        |
| `billingGroupId`    | No       | Billing group for consolidated B2B invoicing             |
| `startDate`         | No       | Subscription start date (default: today)                 |
| `contractLength`    | No       | Contract duration in months (1-120, default: from order) |
| `notes`             | No       | Internal notes for this subscription                     |

## Basic Example

```json theme={null}
{
  "orderId": "ord_abc123",
  "assetSerialNumber": "SN123456789",
  "customerId": "cust_xyz789"
}
```

## Example with Custom Start Date

```json theme={null}
{
  "orderId": "ord_abc123",
  "assetSerialNumber": "SN123456789",
  "customerId": "cust_xyz789",
  "startDate": "2025-02-01"
}
```

<Tip>
  Use a future start date when shipping devices—the subscription (and billing) starts when the customer receives the device, not when you create the record.
</Tip>

## Fulfilling Multi-Unit Orders

For an order with 3 units of the same product:

```javascript theme={null}
const order = await getOrder('ord_abc123');
const item = order.items[0]; // First line item

// Get available assets for this SKU
const { assets } = await listAssets({
  sku: item.sku,
  status: 'available',
  limit: item.quantity
});

// Create subscription for each unit
for (const asset of assets) {
  await createSubscription({
    orderId: order.orderId,
    assetSerialNumber: asset.serialNumber,
    customerId: order.customerId
  });
}
```

## Asset Requirements

The serial number must reference an asset that:

1. **Exists** in your asset inventory
2. **Matches** the SKU from the order item
3. **Is available** (status: `available`)

After subscription creation, the asset status changes to `rented_out`.

## What Gets Created

When you create a subscription:

1. **Subscription record** created with billing schedule
2. **Asset status** updated to `rented_out`
3. **Order progress** updated (rentedDevices count)
4. **First payment** scheduled based on tenant settings
5. **Customer record** updated with new device count

## Billing Start Options

Your tenant settings control when billing starts:

| Setting               | Behavior                           |
| --------------------- | ---------------------------------- |
| `immediate`           | First payment due immediately      |
| `first_of_next_month` | First payment on 1st of next month |
| `same_day_next_month` | First payment same day next month  |

## Error Handling

| Error Code             | Cause                                              | Solution                  |
| ---------------------- | -------------------------------------------------- | ------------------------- |
| `ORDER_NOT_FOUND`      | Invalid order ID                                   | Verify order exists       |
| `ORDER_NOT_CONFIRMED`  | Order not in confirmed status                      | Confirm order first       |
| `ITEM_FULLY_FULFILLED` | All units for this item already have subscriptions | Check order item quantity |
| `ASSET_NOT_FOUND`      | Serial number doesn't exist                        | Create asset first        |
| `ASSET_NOT_AVAILABLE`  | Asset already rented or unavailable                | Use a different asset     |
| `SKU_MISMATCH`         | Asset SKU doesn't match order item                 | Verify correct asset      |

## Related Endpoints

* [Get Order](/api-reference/orders/get) - Check order details and items
* [List Assets](/api-reference/assets/list) - Find available assets
* [Create Asset](/api-reference/assets/create) - Add new assets to inventory
* [List Subscriptions](/api-reference/subscriptions/list) - View created subscriptions


## OpenAPI

````yaml POST /v1/subscriptions
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
    post:
      tags:
        - Subscriptions
      summary: Create a subscription
      description: >-
        Creates a new subscription by assigning a specific asset (device) to a
        customer from an order. This is the order fulfillment step - it links a
        physical device (by serial number) to a line item in an order, creating
        an active subscription.
      operationId: createSubscription
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
                orderId:
                  type: string
                  minLength: 1
                assetSerialNumber:
                  type: string
                  minLength: 1
                customerId:
                  type: string
                  minLength: 1
                billingGroupId:
                  type: string
                startDate:
                  type: string
                  format: date-time
                contractLength:
                  type: integer
                  exclusiveMinimum: 0
                  minimum: 1
                  maximum: 120
                notes:
                  type: string
              required:
                - orderId
                - assetSerialNumber
                - customerId
            example:
              orderId: ord_abc123xyz
              orderItemIndex: 0
              serialNumber: C02ZN1ABCD12
              billingStartOption: immediate
      responses:
        '201':
          description: Subscription created
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
                  rentalId:
                    type: string
                  rental:
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
                required:
                  - success
                  - message
                  - rentalId
                  - rental
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