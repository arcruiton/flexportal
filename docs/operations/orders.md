> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Orders

> Create and manage customer orders in FlexPortal

Orders represent a customer's commitment to subscribe to one or more products. Each order captures customer information, selected products, contract terms, and billing details before subscriptions are activated.

## Order Lifecycle

Orders flow through several statuses:

| Status        | Description                                      |
| ------------- | ------------------------------------------------ |
| **Pending**   | Order created but no subscriptions activated yet |
| **Confirmed** | Order confirmed, ready for fulfillment           |
| **Partial**   | Some items fulfilled, others still pending       |
| **Fulfilled** | All items have active subscriptions              |
| **Cancelled** | Order cancelled, no subscriptions created        |

## Creating a New Order

1. Navigate to **Orders** in the left sidebar
2. Click **New Order** in the top right
3. Fill in customer information:
   * **Email** - Customer's email address
   * **First name** - Customer's first name
   * **Last name** - Customer's last name
   * **Phone** - Contact number (optional)
   * **Customer type** - Individual or Business
4. Add billing and shipping addresses
5. Add order items
6. Click **Save Order**

<Info>
  The order is created with a status of "Pending" until you activate subscriptions by assigning assets to the order items.
</Info>

## Customer Types

FlexPortal supports two customer types:

### Individual

For personal customers:

* Single person billing
* One billing address
* Standard payment terms

### Business

For business customers:

* Company name and registration details
* May belong to a Billing Group for consolidated invoicing
* Can have Net 7, Net 14, or Net 30 payment terms

## Adding Order Items

Order items represent the products being subscribed to. Each item includes the product, variant, contract length, and quantity. Whether ordering a laptop, e-bike, or office chair, the process is the same.

1. Scroll to the **Order Items** section
2. Click **Add Item**
3. Select product details:
   * **Product** - Choose from your product catalog
   * **Variant** - Select the specific variant
   * **Contract length** - Choose 6, 12, 24, or 36 months
   * **Quantity** - Number of units
4. The monthly price automatically populates based on the variant pricing for the selected contract length
5. Click **Add** to save the item

<Tip>
  The total monthly subscription cost appears at the bottom of the order. This is the sum of all items' monthly prices.
</Tip>

## Contract Lengths

Each order item has its own contract length, which determines:

* Monthly payment amount
* Total contract duration
* Contract end date

Supported contract lengths:

* 6 months
* 12 months
* 24 months
* 36 months

<Warning>
  Contract length cannot be changed after order creation. Customers can extend the contract after it ends, but the initial length is fixed.
</Warning>

## Billing and Shipping Addresses

Every order requires a billing address. Shipping addresses are optional if you're delivering products.

### Billing Address

Required fields:

* Street address
* City
* Postal code
* Country

### Shipping Address

If different from billing:

1. Scroll to **Shipping Address**
2. Toggle **Use different shipping address**
3. Enter the shipping details

## Order Confirmation

After creating an order, you can confirm it to signal it's ready for fulfillment:

1. Open the order
2. Click **Confirm Order** in the top right
3. Status changes to "Confirmed"

Confirmed orders are ready to have subscriptions created from their items.

<Info>
  Confirming an order is optional. You can create subscriptions directly from Pending orders.
</Info>

## Fulfilling Orders

Fulfillment means creating active subscriptions from order items. This happens when you assign physical assets (serial numbers) to each item.

### Creating a Subscription from an Order Item

1. Open the order
2. Scroll to the **Items** section
3. Find the item you want to fulfill
4. Click **Create Subscription** next to the item
5. In the dialog:
   * **Serial number** - Enter the asset's serial number
   * **Start date** - When the subscription begins (defaults to today)
6. Click **Create**

The subscription is now active and will appear in the Subscriptions list.

### Fulfilling Multiple Items

For orders with multiple items:

1. Create a subscription for each item individually
2. Assign a different serial number to each item
3. As items are fulfilled, order status changes to "Partial"
4. When all items are fulfilled, status becomes "Fulfilled"

<Tip>
  You can fulfill items at different times. For example, ship available items immediately and fulfill backordered items when they arrive.
</Tip>

## Order Statuses in Detail

### Pending

* Order is created but no action taken
* No subscriptions created yet
* Can be edited or cancelled

### Confirmed

* Order has been reviewed and approved
* Ready for fulfillment
* Can still be edited or cancelled

### Partial

* At least one item has a subscription created
* Other items still need fulfillment
* Order cannot be cancelled (cancel individual subscriptions instead)

### Fulfilled

* All items have active subscriptions
* Order is complete
* No further action needed on the order

### Cancelled

* Order was cancelled before fulfillment
* No subscriptions were created
* Cannot be reactivated (create a new order instead)

## Editing Orders

You can edit orders before subscriptions are created.

1. Open the order
2. Click **Edit** in the top right
3. Modify:
   * Customer information
   * Billing/shipping addresses
   * Order items (add, remove, or change quantities)
4. Click **Save**

<Warning>
  Once a subscription is created from an order item, that item cannot be edited or removed. Edit the subscription directly instead.
</Warning>

## Cancelling Orders

Cancel orders that won't be fulfilled:

1. Open the order
2. Click **Cancel Order** in the top right
3. Confirm cancellation

Orders with active subscriptions cannot be cancelled. Cancel the individual subscriptions instead.

## Viewing Order Details

Order detail page shows:

### Customer Information

* Name and contact details
* Customer type (Individual or Business)
* Billing and shipping addresses

### Order Items

* Product and variant names
* Contract length for each item
* Monthly price per item
* Quantity
* Fulfillment status (Pending or Fulfilled)

### Financial Summary

* Total monthly income from all items
* Total contract value (monthly price times contract length times quantity)

### Subscriptions

* List of active subscriptions created from this order
* Links to each subscription detail page

## Order Search and Filtering

Find orders quickly using search and filters:

### Search by:

* Customer name
* Customer email
* Order ID
* Product name

### Filter by:

* **Status** - Pending, Confirmed, Partial, Fulfilled, Cancelled
* **Customer type** - Individual or Business
* **Date range** - Created date

## Payment Terms for Business Customers

Business customers can have different payment terms:

* **Net 7** - Payment due within 7 days
* **Net 14** - Payment due within 14 days
* **Net 30** - Payment due within 30 days

Set payment terms when creating the order:

1. Select **Business** as customer type
2. Scroll to **Payment Terms**
3. Choose the payment term
4. Save the order

<Info>
  Payment terms only apply to business customers. Individual customers have immediate payment due dates.
</Info>

## Billing Groups for Business Customers

Business customers can belong to a Billing Group for consolidated invoicing:

1. Set customer type to **Business**
2. Select or create a **Billing Group**
3. All subscriptions for customers in this group will be invoiced together

Learn more in the [Payments documentation](/operations/payments#billing-groups).

## Common Scenarios

### Phone Order Entry

When a customer orders over the phone:

1. Create new order
2. Enter customer information as they provide it
3. Add items based on their selections
4. Confirm billing and shipping details
5. Save order as Confirmed
6. Fulfill when ready to ship

### Online Order Processing

For orders from your website or API:

1. Orders arrive automatically via API
2. Review order in dashboard
3. Confirm inventory availability
4. Fulfill by assigning serial numbers
5. Ship products to customer

### Backorder Management

When items are out of stock:

1. Create order with all requested items
2. Fulfill available items immediately
3. Order status becomes "Partial"
4. When backordered items arrive, fulfill remaining items
5. Order status becomes "Fulfilled"

### Creating Test Orders

To test your setup:

1. Create order with test customer email
2. Use real products and pricing
3. Fulfill with test serial numbers
4. Review subscription and payment generation
5. Cancel subscription when testing complete

## Best Practices

### Data Entry

* Double-check customer email addresses
* Verify billing addresses for payment processing
* Use consistent naming for business customers

### Order Management

* Confirm orders before fulfillment
* Fulfill items as soon as assets are available
* Cancel orders promptly if customer withdraws

### Communication

* Send order confirmation emails to customers
* Notify customers when orders are fulfilled
* Provide tracking information for shipped items

### Record Keeping

* Use order notes to record special instructions
* Document any pricing adjustments
* Keep track of customer preferences
