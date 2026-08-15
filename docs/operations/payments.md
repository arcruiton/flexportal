> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Payments

> Handle recurring billing and payment collection

Payments are generated automatically from active subscriptions based on billing schedules. FlexPortal tracks payment status, allows manual payment recording, and supports consolidated billing through Billing Groups.

## How Payment Generation Works

FlexPortal automatically creates payment records for subscriptions:

### Automatic Generation

When a subscription is activated:

1. First payment is generated based on the start date
2. Recurring payments are scheduled monthly or per billing frequency
3. Payments continue until the contract ends

Example:

* Subscription starts: January 1
* Monthly payment: \$89
* 12-month contract
* 12 payments generated: Jan 1, Feb 1, Mar 1... Dec 1

<Info>
  Payments are generated but not automatically collected. You must mark them as paid or integrate with a payment processor.
</Info>

## Payment Statuses

Payments flow through different statuses:

| Status         | Description                      |
| -------------- | -------------------------------- |
| **Pending**    | Payment is due, awaiting payment |
| **Processing** | Payment is being processed       |
| **Paid**       | Payment completed successfully   |
| **Failed**     | Payment attempt unsuccessful     |
| **Cancelled**  | Payment voided or cancelled      |

### Status Details

#### Pending

Payment has been generated and is awaiting payment:

* Shows on customer invoice
* Due date is set
* Waiting for customer to pay

#### Processing

Payment is currently being processed:

* Submitted to payment gateway
* Awaiting confirmation
* Usually brief transition state

#### Paid

Payment completed successfully:

* Funds received
* Applied to subscription
* Increases cost recovery

#### Failed

Payment attempt was unsuccessful due to:

* Payment declined
* Insufficient funds
* Expired card
* Bank rejection

Contact the customer to update their payment method and retry.

#### Cancelled

Payment was voided:

* Subscription cancelled before payment
* Payment no longer needed
* Invoice withdrawn

<Warning>
  Failed payments don't automatically retry. You must manually follow up and mark as paid once resolved.
</Warning>

## Viewing Payments

Navigate to **Payments** in the left sidebar to see all payments across all subscriptions.

The payment list shows:

* Customer name
* Subscription reference
* Amount
* Due date
* Status
* Payment method

Click any payment to view full details.

## Payment Details

The payment detail page includes:

### Payment Information

* Amount
* Currency
* Due date
* Payment date (when paid)
* Status

### Subscription Reference

* Subscription ID
* Product and variant
* Customer name
* Monthly payment amount

### Invoice

* Invoice number
* Invoice date
* Downloadable PDF
* Line items and totals

### Payment Method

* Card type (if card payment)
* Last 4 digits
* Payment processor reference

## Marking Payments as Paid

When you receive payment outside the system (bank transfer, check, cash):

1. Navigate to **Payments**
2. Find the pending payment
3. Click on the payment
4. Click **Mark as Paid** in the top right
5. Enter:
   * **Payment date** - When payment was received
   * **Payment method** - How customer paid
   * **Reference** - Check number, transaction ID, etc.
6. Click **Confirm**

Payment status changes to "Paid" and the amount is added to subscription income.

<Tip>
  Use payment reference to track which check or bank transfer corresponds to each payment.
</Tip>

## Payment Search and Filtering

Find payments quickly:

### Search by:

* Customer name
* Subscription ID
* Invoice number
* Reference number

### Filter by:

* **Status** - Pending, Paid, Failed, Cancelled
* **Due date range** - Payments due in specific period
* **Payment date range** - When payments were received
* **Customer** - All payments for specific customer
* **Billing Group** - All payments for a group

### Sort by:

* Due date (oldest first)
* Amount (high to low)
* Customer name (A-Z)
* Status

## Billing Frequency

Subscriptions can have different billing frequencies:

* **Monthly** - Payment every month (most common)
* **Quarterly** - Payment every 3 months
* **Annually** - One payment per year

Set billing frequency when creating the subscription.

<Info>
  Monthly billing is default and most common. Quarterly or annual billing reduces transaction costs but increases customer commitment.
</Info>

## Failed Payments

When payments fail, take action promptly:

### Handling Failed Payments

1. Payment fails (declined card, insufficient funds)
2. Status changes to "Failed"
3. Customer is notified
4. Contact customer about failure
5. Update payment method
6. Retry the payment manually

### Retry Process

1. Navigate to the failed payment
2. Click **Retry Payment**
3. Confirm payment method is updated
4. Process retry
5. Status changes to Paid if successful

<Warning>
  Multiple failed payments may indicate customer cannot afford the subscription. Consider offering payment plan or early return option.
</Warning>

## Payment Terms for Business Customers

Business customers can have extended payment terms:

| Term       | Due Date                   |
| ---------- | -------------------------- |
| **Net 7**  | 7 days after invoice date  |
| **Net 14** | 14 days after invoice date |
| **Net 30** | 30 days after invoice date |

### Setting Payment Terms

1. Open business customer profile
2. Edit customer details
3. Select **Payment Terms**
4. Save changes

All future invoices use these terms.

Example:

* Invoice generated: January 1
* Payment terms: Net 30
* Due date: January 31

<Info>
  Individual customers have immediate payment due dates (same as invoice date).
</Info>

## Billing Groups

<Info>
  **Dashboard UI Coming Soon** — Billing Group management in the dashboard is currently in development. You can create and manage Billing Groups today using the [Billing Groups API](/api-reference/billing-groups/list).
</Info>

Billing Groups consolidate multiple subscriptions into a single invoice for business customers managing multiple devices or employees.

### What is a Billing Group?

A Billing Group combines multiple customers (usually employees) and subscriptions into a single consolidated invoice with one payment for all subscriptions.

**Example:**

* Company: Acme Corp
* Employees: 5 people with laptops
* Each has subscription
* One invoice to Acme Corp for all 5
* One payment covers all subscriptions

### Creating a Billing Group

1. Navigate to **Billing Groups**
2. Click **New Billing Group**
3. Enter:
   * **Group name** - Company or department name
   * **Primary contact** - Billing contact person
   * **Email** - Where to send invoices
   * **Payment terms** - Net 7, 14, or 30
4. Click **Save**

### Adding Customers to Billing Group

1. Open the Billing Group
2. Click **Add Customer**
3. Search for customer by name or email
4. Select customer
5. Click **Add**

All subscriptions for that customer now bill to the group.

### Billing Group Invoices

Consolidated invoices show:

* All subscriptions in the group
* Line item for each subscription
* Customer name for each line
* Total amount due
* Single payment to cover all

Generate consolidated invoice:

1. Open Billing Group
2. View **Invoices** section
3. Click **Generate Invoice** for the billing period
4. Download PDF
5. Send to billing contact

<Tip>
  Billing Groups simplify B2B billing by reducing invoice count and payment transactions.
</Tip>

## Invoices

Each payment has an associated invoice:

### Invoice Contents

* Invoice number (unique)
* Invoice date
* Due date
* Customer information
* Billing address
* Line items:
  * Product and variant
  * Subscription period
  * Amount
* Subtotal
* Tax (if applicable)
* Total amount due

### Viewing Invoices

1. Navigate to payment
2. Click **Download Invoice**
3. PDF opens or downloads

Or view all invoices for a subscription:

1. Open subscription
2. Scroll to **Payments** section
3. Each payment has invoice link

### Sending Invoices

Email invoices to customers:

1. Download invoice PDF
2. Email to customer's billing contact
3. Include payment instructions
4. Reference invoice number

<Info>
  Future update: Automatic invoice email when payments are generated.
</Info>

## Payment Methods

FlexPortal supports various payment methods:

### Credit/Debit Cards

* Visa, Mastercard, Amex
* Stored securely in payment gateway
* Automatic retry on failure

### Bank Transfer

* Customer transfers funds directly
* Provide bank details on invoice
* Manually mark as paid when received

### Direct Debit

* Automatic withdrawal from customer account
* Requires customer authorization
* Lower failure rate than cards

### Check

* Physical or electronic checks
* Mark as paid when check clears
* Reference check number

### Cash

* In-person payments
* Issue receipt
* Mark as paid immediately

<Warning>
  Always verify payment is received before marking as paid. This ensures accurate financial records.
</Warning>

## Payment Reports

Track payment performance:

### Key Metrics

* **Total income** - All paid payments
* **Outstanding balance** - Pending payments total
* **Payment success rate** - Paid / Total
* **Average payment value** - Mean payment amount
* **Failed payment rate** - Failed / Total

### Viewing Payment Reports

Navigate to **Reports** to see:

* Income over time
* Payment status distribution
* Failed payment trends
* Customer payment history
* Billing Group performance

## Common Scenarios

### Recording Bank Transfer Payment

1. Check bank account for transfer
2. Note transfer reference and amount
3. Find corresponding pending payment
4. Mark as Paid
5. Enter transfer reference
6. Save

### Handling Card Decline

1. Payment fails with status "Failed"
2. System notifies customer
3. Contact customer about decline
4. Customer updates card information
5. Retry payment
6. Verify payment succeeds

### Generating Monthly Invoices for Billing Group

1. Navigate to Billing Group
2. Review all subscriptions in group
3. Generate consolidated invoice
4. Download PDF
5. Email to billing contact
6. Wait for payment
7. Mark group payment as paid

### Customer Disputes Payment

1. Review payment details
2. Check subscription terms
3. Verify payment amount is correct
4. Provide invoice and contract
5. Resolve dispute
6. Adjust payment if necessary

### Setting Up Recurring Card Payments

1. Customer provides card details
2. Store securely in payment gateway
3. Mark card as default payment method
4. Payments automatically attempt to charge card
5. Monitor for failures
6. Update card when expired

## Payment Collection Best Practices

### Timing

* Send invoices 7 days before due date
* Send reminder 2 days before due date
* Follow up immediately on failed payments
* Offer grace period before suspension

### Communication

* Clear payment instructions on invoices
* Multiple payment method options
* Prompt notification of failed payments
* Easy way to update payment methods

### Billing Groups

* Consolidate invoices for businesses
* Single contact person for billing
* Flexible payment terms
* Professional invoice presentation

### Failed Payment Management

* Immediate follow-up
* Multiple retry attempts
* Clear communication of consequences
* Flexible resolution options

## Payment Security

Protect customer payment information.

### PCI Compliance

* Never store full card numbers
* Use payment gateways for card storage
* Tokenize payment methods
* Encrypt sensitive data

### Best Practices

* Secure payment forms
* Verify customer identity
* Monitor for fraud
* Use secure communication channels

<Warning>
  Never ask customers to provide card details via email or unsecured channels.
</Warning>

## Refunds and Credits

Handle refunds when needed:

### Processing Refunds

1. Navigate to the payment
2. Click **Refund Payment**
3. Enter:
   * Refund amount (full or partial)
   * Reason for refund
4. Confirm refund
5. Funds returned to customer

### When to Refund

* Customer charged incorrectly
* Subscription cancelled mid-period
* Early return with refund policy
* Payment dispute resolution
* Service failure or issue

<Tip>
  Document refund reason for accounting and customer service records.
</Tip>

## Integration with Payment Processors

FlexPortal integrates with payment processors for automated collection:

### Supported Processors (Coming Soon)

* Stripe
* PayPal
* Square
* Bank integrations

### Benefits of Integration

* Automatic payment collection
* Reduced manual work
* Faster payment processing
* Better success rates
* Real-time payment status
