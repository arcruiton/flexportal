> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Product Updates

> Latest updates and improvements to FlexPortal

<Update label="2025-12-16" tags={["New release"]}>
  ## VAT & Tax Support

  FlexPortal now supports VAT and tax calculations across all billing flows.

  * **Tax preview** - See tax calculations before finalizing orders
  * **VAT support** - Automatic VAT handling for EU businesses
  * **Tax-inclusive pricing** - Display prices with or without tax
  * **Welcome emails** - New customers receive automated welcome emails with billing details

  Configure tax settings in **Settings → Taxes** in your dashboard.
</Update>

<Update label="2025-12-02" tags={["New release"]}>
  ## Enterprise Billing

  Comprehensive billing features for enterprise customers.

  * **Custom billing cycles** - Flexible billing frequencies for large accounts
  * **Invoice management** - Generate and manage enterprise invoices
  * **Currency support** - Multi-currency billing setup
  * **Overdue payment alerts** - Automatic notifications for overdue payments
  * **Payment permissions** - Role-based access for payment operations

  Contact sales for enterprise billing setup.
</Update>

<Update label="2025-11-18" tags={["New release"]}>
  ## Payments & Billing API

  Full payments API now available for integration.

  * **Payment endpoints** - List, get, mark paid, and cancel payments
  * **First payment handling** - Flexible first payment options
  * **Billing API** - Programmatic billing management
  * **Daily payment metrics** - Historical snapshots for payment analytics

  [View Payments API Documentation](/api-reference/payments/list)
</Update>

<Update label="2025-11-04" tags={["New release"]}>
  ## Order & Subscription Cancellation

  New cancellation workflows for orders and subscriptions.

  * **Order cancellation** - Cancel pending orders before fulfillment
  * **Subscription cancellation** - End subscriptions with reason tracking
  * **Variant protection** - Prevent deletion of variants with active subscriptions
  * **Cancellation history** - Full audit trail of all cancellations

  [View Cancel Order API](/api-reference/orders/cancel) | [View Cancel Subscription API](/api-reference/subscriptions/cancel)
</Update>

<Update label="2025-10-21" tags={["New release"]}>
  ## Product Images & Cost Recovery

  Visual product management and enhanced profitability tracking.

  * **Product images** - Upload and manage product photos with drag & drop
  * **Variant images** - Individual images per variant
  * **Image lightbox** - Full-screen image viewing
  * **Cost recovery dashboard** - Track profitability per asset and subscription
  * **Breakeven indicators** - Color-coded margin and profit metrics

  Upload images in the product edit page under **Products → Edit**.
</Update>

<Update label="2025-10-07" tags={["New release"]}>
  ## Pricing Presets & Customer Management

  Streamlined pricing configuration and customer management.

  * **Pricing presets** - Save and reuse pricing configurations
  * **Custom presets** - Create tailored pricing for specific use cases
  * **Customer management** - Full customer list with search and filters
  * **Asset details** - Enhanced asset information panel with notes
  * **Keyboard shortcuts** - Cmd/Ctrl+Enter to save notes quickly

  Create pricing presets in **Settings → Pricing Presets**.
</Update>

<Update label="2025-09-23" tags={["Improvement"]}>
  ## Enhanced Data Tables

  Major improvements to data display across the platform.

  * **Unified data tables** - Consistent table experience everywhere
  * **Row selection** - Select multiple items for bulk actions
  * **Popover details** - Quick preview without leaving the list
  * **Timeline components** - Visual history for subscriptions and orders
  * **Status badges** - Improved color-coded status indicators

  All list views now use the enhanced data table components.
</Update>

<Update label="2025-09-09" tags={["Improvement"]}>
  ## Dashboard Analytics

  New analytics and reporting capabilities.

  * **Dashboard API** - Programmatic access to key business metrics
  * **Usage statistics** - Query subscription and payment data
  * **Performance optimization** - Faster stats queries with improved indexing
  * **Upgrade tracking** - Track device upgrades with previous subscription links

  [View API Documentation](/api-reference/overview)
</Update>

<Update label="2025-08-25" tags={["Improvement"]}>
  ## Settings & Feature Management

  Reorganized settings for better discoverability.

  * **Settings sections** - Grouped settings by category
  * **Feature toggles** - Enable/disable platform features
  * **Subscription terminology** - "Rentals" now consistently called "Subscriptions"
  * **UI consistency** - Updated labels and navigation across the platform

  Access all settings from the sidebar under **Settings**.
</Update>

<Update label="2025-08-11" tags={["New release"]}>
  ## Settings Panel

  Introducing a comprehensive settings panel to manage your FlexPortal tenant configuration directly from the dashboard.

  * **12 settings sections** - General, Localization, Taxes, Features, Subscriptions, Order Forms, Custom Fields, Addresses, Contracts, Asset Workflow, API Keys, and Activity
  * **Subscription configuration** - Set contract lengths, extension rules, buyout calculations, and early return policies
  * **Custom fields** - Create and manage custom fields for customers, orders, and subscriptions
  * **API key management** - Generate and revoke API keys directly from the dashboard
  * **Activity log** - Track all settings changes with full audit history

  Access Settings from the sidebar navigation in your FlexPortal dashboard.
</Update>

<Update label="2025-07-28" tags={["New release"]}>
  ## FlexPortal API

  The FlexPortal API is now publicly available, enabling you to build integrations and automate your subscription workflows.

  **Endpoints:**

  * **Orders** - Create subscription orders, list and retrieve order details
  * **Subscriptions** - Full lifecycle management including buyout, extend, upgrade, replace, and early return
  * **Products** - Create, update, import via CSV, and manage product variants
  * **Customers** - List, retrieve, and update customer records
  * **Assets** - Track physical products with serial numbers
  * **Files** - Manage documents and generate contracts
  * **Exports** - Export subscription data for reporting

  **Features:**

  * Bearer token authentication
  * Available in EU, US, and Qatar regions
  * Interactive API playground in docs

  [View API Reference](/api-reference/overview)
</Update>

<Update label="2025-07-14" tags={["New release"]}>
  ## Multi-Region Support

  FlexPortal is now available in multiple regions for better performance and data residency.

  * **EU Region** - api-eu.flexportal.io for European customers
  * **US Region** - api-us.flexportal.io for North American customers
  * **Qatar Region** - api-qatar.flexportal.io for Middle East customers
  * **Region-specific data** - Data stays within your chosen region

  Choose your region during onboarding based on your customer base location.
</Update>
