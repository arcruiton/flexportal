> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Customers

> Track customer information and relationships

# Managing Customers

Customers are the individuals or businesses that subscribe to your products. FlexPortal tracks customer information, orders, subscriptions, and lifetime value.

## Customer Types

FlexPortal supports two types of customers:

### Individual

Personal customers subscribing for their own use:

* Single person billing
* One billing address
* Standard payment terms
* Personal email and contact

**Common use cases:**

* Consumer subscriptions
* Personal device subscriptions
* Individual accounts

### Business

Companies or organizations subscribing for business use:

* Company name and registration details
* Business billing address
* Extended payment terms (Net 7, Net 14, Net 30)
* Business email and contact person
* Can belong to Billing Groups

**Common use cases:**

* Corporate device programs
* Office furniture subscriptions
* Employee equipment
* Fleet management

<Info>
  Choose customer type at order creation. This determines available payment terms and billing options.
</Info>

## Creating a Customer

Customers are created when you create an order:

1. Navigate to **Orders**
2. Click **New Order**
3. Enter customer information:
   * **Email** - Primary contact email
   * **First name** - Customer's first name
   * **Last name** - Customer's last name
   * **Phone** - Contact number
   * **Customer type** - Individual or Business
4. For business customers, also enter:
   * **Company name**
   * **Registration number** (optional)
   * **VAT number** (if applicable)
5. Add billing address
6. Save the order

The customer is now in your system and can be selected for future orders.

<Tip>
  Customers with the same email address are automatically linked. Use the same email for repeat customers.
</Tip>

## Customer Information

Each customer profile includes:

### Contact Details

* Full name
* Email address
* Phone number
* Customer type (Individual or Business)

### Business Information (Business customers only)

* Company name
* Registration number
* VAT number
* Payment terms (Net 7, Net 14, Net 30)
* Billing Group (if applicable)

### Addresses

* Billing address
* Shipping addresses (can have multiple)

### Financial Information

* Lifetime value (total income collected)
* Outstanding balance
* Payment history
* Number of active subscriptions

## Viewing Customer Details

1. Navigate to **Customers** in the left sidebar
2. Click on a customer name

The customer detail page shows:

### Overview

* Contact information
* Customer type
* Active subscriptions count
* Lifetime value

### Active Subscriptions

List of all currently active subscriptions:

* Product and variant
* Monthly payment
* Contract end date
* Cost recovery

### Order History

All orders placed by this customer:

* Order date
* Products ordered
* Order status
* Total value

### Payment History

All payments made or pending:

* Payment date
* Amount
* Status (Paid, Pending, Failed)
* Associated subscription

### Addresses

All addresses on file:

* Billing addresses
* Shipping addresses
* Address history

## Customer Addresses

Customers can have multiple addresses:

### Billing Address

Primary address for invoicing:

* Required for all customers
* Used for payment processing
* Can be updated anytime

### Shipping Addresses

Delivery addresses for products:

* Can have multiple shipping addresses
* Used when fulfilling orders
* Different addresses for different subscriptions

### Managing Addresses

1. Open the customer profile
2. Scroll to **Addresses** section
3. Click **Add Address** to add new
4. Click **Edit** to update existing
5. Set one address as default billing
6. Save changes

<Info>
  When creating new orders, addresses from the customer profile auto-populate for convenience.
</Info>

## Viewing Customer Orders and Subscriptions

See complete history for each customer:

### Active Subscriptions

1. Open customer profile
2. View **Active Subscriptions** section
3. Click any subscription to see details

Shows:

* Product and variant
* Asset serial number
* Monthly payment
* Contract end date
* Next payment date

### Order History

1. Scroll to **Orders** section
2. See all orders placed
3. Click any order to view details

Shows:

* Order date
* Items ordered
* Order status
* Total value

### Payment History

1. Scroll to **Payments** section
2. See all payments
3. Filter by status (Paid, Pending, Failed)

Shows:

* Payment date
* Amount
* Status
* Subscription reference

## Customer Lifetime Value

Lifetime value shows total income collected from a customer across all subscriptions:

```
Lifetime Value = Sum of all payments received from customer
```

Example:

* First subscription: 12 months × \$89 = \$1,068
* Second subscription: 6 months × \$129 = \$774
* Buyout payment: \$300
* Total lifetime value: \$2,142

### Viewing Lifetime Value

Customer detail page shows:

* **Lifetime collected** - Total income to date
* **Active monthly income** - Current recurring income
* **Average subscription value** - Mean value per subscription
* **Number of subscriptions** - Total count (active + ended)

<Tip>
  Sort customers by lifetime value to identify your most valuable customers.
</Tip>

## Business Customer Features

Business customers have additional capabilities:

### Payment Terms

Set when invoices are due:

* **Net 7** - Payment due within 7 days
* **Net 14** - Payment due within 14 days
* **Net 30** - Payment due within 30 days

Configure payment terms:

1. Open business customer
2. Edit customer details
3. Select **Payment Terms**
4. Save changes

All new subscriptions for this customer will use these terms.

### Billing Groups

Group multiple business customers for consolidated invoicing:

1. Create or select a Billing Group
2. Add customer to the group
3. All subscriptions invoice to the Billing Group

Learn more in [Payments - Billing Groups](/operations/payments#billing-groups).

### Company Information

Track business details:

* Legal company name
* Registration number
* VAT/Tax ID
* Billing contact person

This information appears on invoices and contracts.

## Customer Search and Filtering

Find customers quickly:

### Search by:

* Customer name
* Email address
* Company name
* Phone number

### Filter by:

* **Customer type** - Individual or Business
* **Active subscriptions** - Has active subscriptions or not
* **Lifetime value** - Value ranges
* **Billing Group** - Group membership

### Sort by:

* Name (A-Z)
* Lifetime value (high to low)
* Number of subscriptions
* Join date

## Customer Communication

Document all customer interactions:

### Contact History

1. Open customer profile
2. Scroll to **Notes** section
3. Click **Add Note**
4. Enter:
   * Date of interaction
   * Type (Email, Phone, Meeting)
   * Summary of conversation
   * Follow-up actions needed
5. Save note

<Tip>
  Use notes to track customer preferences, special requests, or issues. This helps maintain continuity across team members.
</Tip>

## Editing Customer Information

Update customer details as needed:

1. Navigate to **Customers**
2. Click on the customer
3. Click **Edit** in the top right
4. Update:
   * Contact information
   * Customer type
   * Business details
   * Payment terms
5. Click **Save**

<Warning>
  Changing customer information does not affect existing subscriptions. Updates apply to new orders only.
</Warning>

## Merging Duplicate Customers

If the same customer is created multiple times:

1. Identify duplicate customer records
2. Choose the primary record to keep
3. Contact support to merge duplicates
4. All orders and subscriptions move to primary record

<Info>
  Avoid duplicates by searching for existing customers before creating new orders.
</Info>

## Customer Segments

Categorize customers for targeted communication.

### Segmentation Ideas

* **High-value customers** - Lifetime value over threshold
* **At-risk customers** - Recent payment failures
* **Loyal customers** - Multiple subscriptions or extensions
* **New customers** - First subscription within 30 days
* **Business customers** - All business type customers

### Creating Segments

Use filters to identify segments:

1. Apply relevant filters
2. Export customer list
3. Use for marketing or support campaigns

## Customer Preferences

Track customer-specific preferences:

### Subscription Preferences

* Preferred contract lengths
* Payment methods
* Billing frequency
* Communication preferences

### Product Preferences

* Preferred product categories
* Color or variant preferences
* Upgrade patterns

Document preferences in customer notes for personalized service.

## Common Scenarios

### Repeat Customer Places New Order

1. Search for customer by email
2. Create new order
3. Customer information auto-populates
4. Add new items
5. Confirm billing and shipping details
6. Save order

### Customer Changes Address

1. Open customer profile
2. Edit existing address or add new
3. Save changes
4. Next order uses updated address

### Business Customer Needs Invoice

1. Navigate to customer's subscriptions
2. View payment history
3. Click on specific payment
4. Download invoice PDF
5. Email to customer

### Customer Requests Account Information

1. Open customer profile
2. Review:
   * Active subscriptions
   * Payment history
   * Contract end dates
   * Outstanding balance
3. Export data if needed
4. Provide to customer

### Customer Has Payment Issue

1. View customer's payment history
2. Identify failed payments
3. Contact customer about payment method
4. Update payment information
5. Retry failed payment or mark as paid

## Best Practices

### Data Quality

* Verify email addresses at order creation
* Keep contact information up to date
* Use consistent naming conventions
* Document business registration details

### Customer Communication

* Respond to inquiries promptly
* Maintain communication history in notes
* Set reminders for contract end dates
* Proactively reach out to at-risk customers

### Relationship Management

* Track customer lifetime value
* Identify and reward loyal customers
* Address issues quickly
* Provide excellent service

### Privacy and Security

* Only collect necessary information
* Secure customer data appropriately
* Honor communication preferences
* Comply with data protection regulations

### Business Customer Management

* Understand payment terms
* Set up Billing Groups appropriately
* Maintain accurate business details
* Provide consolidated reporting

## Customer Analytics

Track customer metrics:

### Key Metrics

* Total customer count
* Active customers (with active subscriptions)
* Customer acquisition rate
* Average lifetime value
* Churn rate
* Payment failure rate

### Viewing Analytics

Navigate to **Reports** or **Dashboard** to see:

* Customer growth over time
* Lifetime value distribution
* Customer segments
* Active vs inactive customers

Use these insights to:

* Identify growth opportunities
* Reduce churn
* Improve customer experience
* Optimize pricing and offerings
