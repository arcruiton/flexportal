> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Integrations

> Connect FlexPortal with your existing tools and workflows

FlexPortal is built API-first, designed to integrate seamlessly with your existing systems. Whether you're connecting payment processors, e-commerce platforms, or building custom workflows, FlexPortal provides the tools you need.

## API-First Philosophy

Every feature in FlexPortal is accessible through our REST API. This means you can:

* Automate subscription workflows
* Build custom integrations with your existing systems
* Create tailored customer experiences
* Sync data between platforms in real-time

<Card title="API Reference" icon="code" href="/api-reference/overview">
  Explore the complete FlexPortal API documentation
</Card>

## REST API

FlexPortal's REST API gives you complete control over your subscription platform:

<CardGroup cols={2}>
  <Card title="Products & Assets" icon="box">
    Manage your product catalog and track physical assets by serial number
  </Card>

  <Card title="Subscriptions" icon="rotate">
    Create, extend, upgrade, and manage the complete subscription lifecycle
  </Card>

  <Card title="Customers & Billing" icon="users">
    Handle customer data, billing groups, and consolidated invoicing
  </Card>

  <Card title="Payments" icon="credit-card">
    Track payments, update status, and manage recurring billing
  </Card>
</CardGroup>

### Key Features

* **Full CRUD Operations** — Create, read, update, and delete across all resources
* **Batch Operations** — Import products via CSV, bulk update assets
* **Calculated Endpoints** — Get buyout prices and early return fees without making changes
* **File Management** — Generate contracts, upload documents, manage customer files

## Webhooks

Real-time webhooks keep your systems in sync with FlexPortal events:

* Subscription status changes (activated, cancelled, completed)
* Payment events (paid, failed, pending)
* Asset updates (assigned, returned, condition changed)
* Contract lifecycle events (extended, upgraded, bought out)

<Info>
  Webhook documentation is coming soon. Sign up for updates at [www.flexportal.io](https://www.flexportal.io)
</Info>

## Available Integrations

### Stripe

<Card title="Stripe Integration" icon="stripe" href="/integrations/stripe">
  **Coming Soon** — Automated recurring payments and billing
</Card>

### Shopify

<Card title="Shopify Integration" icon="shopify" href="/integrations/shopify">
  **Coming Soon** — Sync products and capture subscription orders from your storefront
</Card>

## Custom Integrations

Building a custom integration? Here's what you need:

<Steps>
  <Step title="Get API Credentials" icon="key">
    Generate your API key from the FlexPortal dashboard under Settings → API
  </Step>

  <Step title="Choose Your Region" icon="globe">
    Select the correct API endpoint for your Business Unit (EU, US, or Qatar)
  </Step>

  <Step title="Test Your Integration" icon="flask">
    Use our Playground mode to test requests before going live
  </Step>

  <Step title="Set Up Webhooks" icon="webhook">
    Configure webhook endpoints to receive real-time event notifications
  </Step>
</Steps>

## Authentication

All API requests require Bearer token authentication:

```bash theme={null}
curl https://api-eu.flexportal.io/api/v1/products \
  -H "Authorization: Bearer YOUR_API_KEY"
```

<Card title="API Authentication Guide" icon="shield" href="/api-reference/overview">
  Learn about API authentication, rate limits, and best practices
</Card>

## Need Help?

Building an integration and need support?

* **Documentation** — [API Reference](/api-reference/overview)
* **Email** — [support@flexportal.io](mailto:support@flexportal.io)
* **Custom Integration** — [Contact us](https://www.flexportal.io/contact) for integration support

## Coming Soon

We're actively building integrations with popular platforms:

| Integration    | What It Does                                                   | Status         |
| -------------- | -------------------------------------------------------------- | -------------- |
| **Stripe**     | Automated recurring payments, card management, payment retries | In Development |
| **Shopify**    | Product sync, checkout integration, order capture              | In Development |
| **QuickBooks** | Accounting sync, invoice generation, revenue tracking          | Planned        |
| **Zapier**     | No-code automation with 5,000+ apps                            | Planned        |

<Info>
  Want to see a specific integration? Let us know at [support@flexportal.io](mailto:support@flexportal.io)
</Info>
