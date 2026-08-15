> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Stripe Integration

> Automated recurring payments with Stripe

<Info>
  **Coming Soon** — Stripe integration is currently in development. Sign up for updates at [flexportal.io](https://flexportal.io)
</Info>

The Stripe integration will enable automated recurring payments, card management, and payment retries for your FlexPortal subscriptions.

## What Stripe Integration Will Enable

<CardGroup cols={2}>
  <Card title="Automated Payments" icon="credit-card">
    Charge customers automatically on their billing cycle without manual intervention
  </Card>

  <Card title="Card Management" icon="wallet">
    Securely store customer payment methods with Stripe's PCI-compliant infrastructure
  </Card>

  <Card title="Payment Retries" icon="rotate">
    Automatically retry failed payments with smart retry logic
  </Card>

  <Card title="Multiple Payment Methods" icon="money-bill">
    Support credit cards, debit cards, and digital wallets
  </Card>
</CardGroup>

## Key Features

### Recurring Billing

* Automatically charge subscription payments based on your billing frequency
* Handle proration for mid-cycle upgrades and extensions
* Support for multiple currencies

### Payment Intelligence

* Smart retry logic for failed payments
* Dunning management to recover failed payments
* Real-time payment status updates via webhooks

### Customer Experience

* Secure card storage with Stripe Vault
* Easy payment method updates
* Support for 3D Secure authentication

### Reconciliation

* Automatic payment reconciliation between Stripe and FlexPortal
* Transaction history and audit trail
* Payout tracking and reporting

## Current State: Manual Payment Tracking

Today, FlexPortal generates scheduled payments that you manually mark as paid:

```javascript theme={null}
// Current workflow
const payment = await flexportal.payments.markPaid(paymentId, {
  paid_at: '2025-12-19T10:00:00Z',
  payment_method: 'card',
  notes: 'Processed via external payment gateway'
});
```

You handle payment processing through your own systems and update FlexPortal when payments are collected.

## Future State: Automated Stripe Payments

With Stripe integration:

```javascript theme={null}
// Future workflow - automated
const subscription = await flexportal.subscriptions.create({
  customer_id: 'cus_123',
  product_id: 'prod_456',
  contract_length_months: 12,
  stripe_payment_method_id: 'pm_card_xyz' // Stripe automatically charges
});

// Payments are charged and marked paid automatically
// Webhooks notify you of payment success or failure
```

## How It Will Work

<Steps>
  <Step title="Connect Stripe Account" icon="link">
    Link your Stripe account to FlexPortal with one-click OAuth integration
  </Step>

  <Step title="Configure Payment Settings" icon="gear">
    Set payment retry rules, dunning strategies, and notification preferences
  </Step>

  <Step title="Add Payment Methods" icon="credit-card">
    Customers add cards securely through Stripe Checkout or Elements
  </Step>

  <Step title="Automatic Billing" icon="bolt">
    FlexPortal automatically charges customers on their billing cycle
  </Step>

  <Step title="Handle Events" icon="webhook">
    Receive webhooks for payment success, failure, and retry events
  </Step>
</Steps>

## Supported Payment Methods

The Stripe integration will support:

* Credit and debit cards (Visa, Mastercard, Amex, Discover)
* Apple Pay and Google Pay
* SEPA Direct Debit (Europe)
* ACH Direct Debit (United States)
* Digital wallets (Link, Click to Pay)

## Pricing

Stripe charges standard payment processing fees:

* **Card payments**: 2.9% + 30¢ per successful charge
* **Digital wallets**: 2.9% + 30¢ per successful charge
* **ACH/SEPA**: 0.8% (capped at \$5)

FlexPortal does not add additional fees for the Stripe integration.

## Migration Path

Already processing payments manually? We'll provide tools to:

* Migrate existing customers to Stripe payment methods
* Maintain payment history and reconciliation
* Gradually transition to automated billing
* Preserve all existing subscription data

## Get Notified

Want to be first to know when Stripe integration launches?

<Card title="Sign Up for Updates" icon="bell" href="https://www.flexportal.io">
  Get notified when Stripe integration is available
</Card>

## Questions?

### Will existing subscriptions work with Stripe?

Yes. You'll be able to migrate existing subscriptions to use Stripe payments without disrupting service.

### Can I use my existing Stripe account?

Yes. Connect your existing Stripe account to FlexPortal. Your customers, payment history, and settings stay with you.

### What happens to payment history?

All existing payment records in FlexPortal are preserved. Stripe integration adds automated charging to new and migrated subscriptions.

### Do I need Stripe to use FlexPortal?

No. Stripe integration is optional. You can continue manual payment tracking or integrate with other payment providers via API.

## Alternative: Use the API Today

You can integrate FlexPortal with Stripe (or any payment processor) today using our API:

1. Create subscriptions via FlexPortal API
2. Process payments through Stripe API
3. Mark payments as paid in FlexPortal when Stripe confirms

<Card title="API Reference" icon="code" href="/api-reference/payments/mark-paid">
  Learn how to mark payments as paid via API
</Card>
