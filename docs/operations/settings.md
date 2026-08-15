> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Settings

> Configure your FlexPortal organization and Business Units

Settings in FlexPortal are organized into two levels: Organization settings (apply to your entire account) and Business Unit settings (apply to a specific Business Unit).

<Info>
  Switch between Business Units using the dropdown in the top navigation. Settings changes only affect the currently selected Business Unit.
</Info>

***

## Organization Settings

Organization settings affect your entire FlexPortal account. Only organization owners can access these settings.

### Organization

Manage your organization profile.

| Setting               | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| **Organization Name** | Your company name, used for billing and legal purposes         |
| **Subscription Tier** | Current plan (Starter, Growth, Enterprise) with upgrade option |
| **Business Units**    | View all Business Units with their status and limits           |

### Plan & Billing

View and manage your FlexPortal subscription.

| Setting                  | Description                                   |
| ------------------------ | --------------------------------------------- |
| **Current Plan**         | Your pricing tier and platform fee percentage |
| **Billing Cycle**        | Monthly or annual billing                     |
| **Business Units Limit** | Maximum Business Units allowed on your plan   |
| **Invoices**             | Download past invoices                        |

**Platform Fees by Tier:**

* Starter: 5% of subscription income
* Growth: 3% of subscription income
* Enterprise: 1.5% or custom negotiated rate

### Security

Configure organization-wide security settings.

| Setting             | Description                                            |
| ------------------- | ------------------------------------------------------ |
| **Require MFA**     | Enforce two-factor authentication for all team members |
| **Session Timeout** | Enable automatic logout after inactivity               |

**Session Timeout Options (when enabled):**

| Setting                    | Options                                                             |
| -------------------------- | ------------------------------------------------------------------- |
| **Session Duration**       | 15 min, 30 min, 1 hour, 4 hours, 8 hours, 24 hours, 7 days, 30 days |
| **Warning Before Timeout** | 1 min, 5 min, 10 min, 15 min                                        |
| **Force Logout**           | Revoke refresh tokens when session expires                          |
| **Track Activity**         | Reset timeout on user interaction                                   |

***

## Business Unit Settings

### General

Basic Business Unit configuration.

| Setting          | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| **Display Name** | Name shown in dashboard (e.g., "Store US", "Store EU")                |
| **ID Prefix**    | 1-5 character prefix for order, subscription, asset, and customer IDs |

**Read-Only Fields:**

* Business Unit ID (for API calls)
* Currency (set during creation)
* Data Region
* Country
* Status

<Warning>
  Currency cannot be changed after Business Unit creation. Create separate Business Units for different currencies.
</Warning>

### Localization

Currency, language, and regional settings.

| Setting         | Description                                                   |
| --------------- | ------------------------------------------------------------- |
| **Timezone**    | Business Unit timezone (80+ IANA timezones supported)         |
| **Date Format** | DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY, or DD.MM.YYYY |

### Taxes

Configure tax calculation and display.

| Setting              | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| **Enable VAT**       | Toggle tax collection                                       |
| **VAT Number**       | Your tax registration number                                |
| **Default VAT Rate** | Percentage applied to payments (0-100%)                     |
| **VAT Calculation**  | Exclusive (added to price) or Inclusive (included in price) |

***

## Platform Features

Enable or disable platform capabilities. Some settings sections only appear when their feature is enabled.

### Features

Toggle optional platform features.

| Feature                           | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| **Payments**                      | Payment capture method (Manual or Stripe)       |
| **Checkout**                      | Enable hosted checkout page (coming soon)       |
| **Files**                         | Enable file management                          |
| **Automatic Contract Generation** | Generate PDF contracts for subscriptions        |
| **Timeline**                      | Enable activity timeline and notes              |
| **E-Commerce Integration**        | Connect to Shopify or WooCommerce (coming soon) |

<Info>
  Enabling a feature reveals its configuration section in the settings sidebar.
</Info>

### Payments

Configure payment handling and billing cycles.

**Billing & Invoicing:**

| Setting           | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| **Billing Cycle** | Subscription start date, Fixed day of month, or Every 30 days    |
| **Day of Month**  | 1-28 (when using fixed day)                                      |
| **First Payment** | Full month, Pro-rated, Free until cycle, or Collected externally |
| **Payment Terms** | Due immediately, Net 7, Net 14, or Net 30                        |

**Failed Payment Handling:**

| Setting             | Description                                        |
| ------------------- | -------------------------------------------------- |
| **Automatic Retry** | Retry failed card payments (when Stripe connected) |
| **Max Attempts**    | 1-5 retry attempts                                 |
| **Late Fees**       | Enable late fee charges                            |
| **Fee Type**        | Flat amount or Percentage of payment               |
| **Grace Period**    | Days before late fee applies                       |

### Checkout

Configure the customer checkout experience. Only visible when Checkout feature is enabled.

**Payment Methods:**

| Setting                   | Description                         |
| ------------------------- | ----------------------------------- |
| **Invoice/Bank Transfer** | Always available                    |
| **Card Payment**          | Requires connected payment provider |

**Checkout Mode:**

| Mode       | Description                           |
| ---------- | ------------------------------------- |
| **B2C**    | Consumer checkout                     |
| **B2B**    | Business checkout with company fields |
| **Hybrid** | Customer chooses their type           |

**B2B Settings (when B2B or Hybrid):**

| Setting                    | Description                   |
| -------------------------- | ----------------------------- |
| **Require Company Name**   | Company name is mandatory     |
| **Require VAT Number**     | Tax ID is mandatory           |
| **Require Purchase Order** | PO number is mandatory        |
| **Allow Invoice Payment**  | Enable invoice payment method |

**Branding:**

| Setting              | Description                         |
| -------------------- | ----------------------------------- |
| **Primary Color**    | Brand color for buttons and accents |
| **Background Color** | Page background color               |
| **Border Radius**    | None, Small, Medium, Large, or Full |

**Content:**

| Setting             | Description                         |
| ------------------- | ----------------------------------- |
| **Page Title**      | Checkout page heading               |
| **Button Text**     | Submit button label                 |
| **Success Message** | Confirmation message after checkout |
| **Terms URL**       | Link to your terms and conditions   |

**Fields:**

| Setting                      | Description              |
| ---------------------------- | ------------------------ |
| **Collect Billing Address**  | Request billing address  |
| **Collect Shipping Address** | Request shipping address |
| **Collect Phone Number**     | Request phone number     |

**Quantity:**

| Setting                      | Description                   |
| ---------------------------- | ----------------------------- |
| **Allow Quantity Selection** | Let customers choose quantity |
| **Maximum Quantity**         | 1-100 per order               |

**Redirects:**

| Setting         | Description                        |
| --------------- | ---------------------------------- |
| **Success URL** | Redirect after successful checkout |
| **Cancel URL**  | Redirect if customer cancels       |

### Timeline

Configure activity timeline display. Only visible when Timeline feature is enabled.

| Setting          | Description                    |
| ---------------- | ------------------------------ |
| **Enable Notes** | Allow adding notes to timeline |

### E-Commerce

Configure e-commerce platform integration. Only visible when E-Commerce feature is enabled.

| Setting      | Description                                      |
| ------------ | ------------------------------------------------ |
| **Platform** | Shopify (coming soon), WooCommerce (coming soon) |

***

## Configuration

Detailed configuration for subscriptions, pricing, and workflows.

### Subscriptions

Configure subscription behavior across extensions, upgrades, buyouts, early returns, and contract end.

#### Extensions Tab

| Setting                             | Description                                            |
| ----------------------------------- | ------------------------------------------------------ |
| **Available Extensions**            | Extension options to offer (e.g., 6, 12, 24 months)    |
| **Max Extensions per Subscription** | Limit on how many times a subscription can be extended |
| **Minimum Days Before End**         | How close to contract end extensions become available  |
| **Require Approval**                | Extensions need manager approval                       |
| **Create Order for Extensions**     | Auto-generate tracking order for extensions            |

#### Upgrades Tab

| Setting             | Description                                      |
| ------------------- | ------------------------------------------------ |
| **Enable Upgrades** | Allow customers to upgrade to different products |

#### Buyouts Tab

| Setting                   | Description                                |
| ------------------------- | ------------------------------------------ |
| **Enable Buyout**         | Allow customers to purchase assets         |
| **Calculation Method**    | How buyout price is calculated             |
| **Allow Manual Override** | Staff can enter custom buyout price        |
| **Allow RRP Estimation**  | Estimate retail price from monthly payment |

**Buyout Calculation Methods:**

| Method                       | Description                               |
| ---------------------------- | ----------------------------------------- |
| **Flat Fee**                 | Fixed buyout amount                       |
| **Remaining Months Only**    | Sum of remaining payments                 |
| **RRP Percentage Only**      | Percentage of retail price                |
| **Remaining Months + RRP %** | Remaining payments plus percentage of RRP |

#### Early Return Tab

| Setting                   | Description                                       |
| ------------------------- | ------------------------------------------------- |
| **Enable Early Return**   | Allow returns before contract end                 |
| **Fee Calculation**       | Remaining months, Flat fee, or No fee             |
| **Allow Manual Override** | Staff can enter custom fee                        |
| **Grace Period**          | Days for fee-free return after subscription start |

#### Contract End Tab

| Setting                | Description                             |
| ---------------------- | --------------------------------------- |
| **When Contract Ends** | Behavior when contract reaches end date |

**Contract End Options:**

| Option                   | Description                     |
| ------------------------ | ------------------------------- |
| **Auto-renew Monthly**   | Continue month-to-month         |
| **Auto-renew Same Term** | Renew for same contract length  |
| **Require Action**       | Customer must choose an option  |
| **Auto-terminate**       | Subscription ends automatically |

#### Fee Calculation

| Setting                      | Description                               |
| ---------------------------- | ----------------------------------------- |
| **Partial Months Rounding**  | Round up or down for partial month fees   |
| **Charge for Current Month** | Include current month in fee calculations |

### Pricing

Configure pricing economics and contract terms.

**Subscription Economics:**

| Setting                    | Description                                    |
| -------------------------- | ---------------------------------------------- |
| **Value Recovery Percent** | Percentage of asset value to recover (10-100%) |
| **Profit Margin**          | Markup on top of recovery (0-100%)             |

**Contract Lengths:**

Configure available contract options:

* Add/remove contract lengths (1-120 months)
* Set adjustment percentage for each length (-50% to +100%)
* Mark one as default

**Price Rounding:**

| Setting             | Description                                         |
| ------------------- | --------------------------------------------------- |
| **Enable Rounding** | Round calculated prices                             |
| **Rounding Mode**   | Nearest, Always Up, or Always Down                  |
| **Round To**        | Whole Number, Nearest 5, Nearest 10, or Nearest 100 |

**Warnings:**

| Setting                | Description                               |
| ---------------------- | ----------------------------------------- |
| **Low Price Warnings** | Alert when monthly price is unusually low |

### Pricing Presets

Pre-configured pricing templates for different industries.

**Built-In Presets:**

* Electronics (80% recovery, 20% margin)
* Gaming (75% recovery, 24% margin)
* Furniture (60% recovery, 28% margin)
* Baby & Kids (50% recovery, 32% margin)
* Medical (85% recovery, 28% margin)
* Mobility (70% recovery, 25% margin)
* Appliances (65% recovery, 26% margin)

Each preset includes:

* Value recovery and margin percentages
* Default contract lengths and adjustments
* Rounding configuration
* Margin guidance text

**Custom Presets:**

Create your own pricing presets to quickly apply configurations across products.

### Catalog

Configure product categories and conditions.

**Categories:**

| Setting         | Description            |
| --------------- | ---------------------- |
| **Category ID** | Unique identifier      |
| **Name**        | Display name           |
| **Description** | Optional description   |
| **Sort Order**  | Display order in lists |

**Conditions:**

Enable condition-based pricing for refurbished or used products.

| Setting               | Description                                  |
| --------------------- | -------------------------------------------- |
| **Enable Conditions** | Allow condition variants                     |
| **Condition Code**    | Unique identifier (e.g., "new", "like\_new") |
| **Display Name**      | Shown to customers                           |
| **RRP Factor**        | Price multiplier (0.1-1.0)                   |

**Default Conditions:**

* New (1.0x)
* Like New (0.9x)
* Good (0.8x)
* Fair (0.7x)

### Order Forms

Configure order creation fields.

| Setting               | Description               |
| --------------------- | ------------------------- |
| **Quantity Editable** | Allow quantity changes    |
| **Default Quantity**  | Pre-filled quantity value |
| **Minimum Quantity**  | Lowest allowed quantity   |
| **Maximum Quantity**  | Highest allowed quantity  |

### Custom Fields

Define custom data fields for customers, orders, and subscriptions.

**For Each Custom Field:**

| Setting      | Description                                      |
| ------------ | ------------------------------------------------ |
| **Field ID** | Unique identifier (no spaces)                    |
| **Label**    | Display name                                     |
| **Type**     | Text, Email, Phone, Number, Text Area, or Select |
| **Required** | Field must be filled                             |
| **Section**  | Customer, Order, or Subscription                 |

**Phone Format Options:**

| Format                                     | Description            |
| ------------------------------------------ | ---------------------- |
| International                              | +XX format             |
| US/Canada                                  | +1 format              |
| UK                                         | +44 format             |
| Germany, France, Spain, Italy, Netherlands | Country-specific       |
| Nordics                                    | Nordic countries       |
| Australia, China, Japan, South Korea       | APAC formats           |
| Brazil, Mexico                             | Latin America          |
| UAE, Saudi Arabia, Qatar                   | Middle East            |
| Custom                                     | Your own regex pattern |

**Text Validation Options:**

| Setting          | Description              |
| ---------------- | ------------------------ |
| **Min Length**   | Minimum characters       |
| **Max Length**   | Maximum characters       |
| **Exact Length** | Exact character count    |
| **Pattern**      | Regex validation pattern |

### Addresses

Configure address form fields.

**Company Field:**

| Setting              | Description                                       |
| -------------------- | ------------------------------------------------- |
| **Show Company For** | Individual customers, Business customers, or Both |

**Address Fields:**

Configure visibility, required status, and custom labels for:

* Company Name
* Building/Apt
* Street Address (always required)
* Area/District
* City (always required)
* State/Province
* Postal Code
* Country (always required)

### Contracts

Configure contract PDF generation. Only visible when Contract Generation is enabled.

**Contract Templates:**

| Setting             | Description                    |
| ------------------- | ------------------------------ |
| **Template Upload** | Upload PDF template            |
| **Auto-Generate**   | Create contracts automatically |

**Field Mapping:**

Map FlexPortal data to contract template fields. Three separate mappings for:

* **Order Contracts** — Generated when subscription is created
* **Extension Contracts** — Generated when subscription is extended
* **Upgrade Contracts** — Generated when customer upgrades

Each mapping connects template placeholders to:

* Customer fields (name, email, address, custom fields)
* Order fields (order number, date, items)
* Subscription fields (ID, dates, pricing, asset info)
* Product fields (name, variant, specifications)

### Asset Workflow

Configure asset lifecycle handling.

| Setting                | Description                                 |
| ---------------------- | ------------------------------------------- |
| **Require Inspection** | Require inspection step for returned assets |
| **Inspection States**  | Custom workflow states for returned assets  |

<Info>
  For phone products, FlexPortal validates IMEI numbers (15 digits with Luhn check). Other product categories accept any serial number format.
</Info>

***

## System

Technical and integration settings.

### API Keys

Manage API access for your Business Unit.

| Setting            | Description                                     |
| ------------------ | ----------------------------------------------- |
| **Tenant ID**      | Your Business Unit ID (required in API headers) |
| **Create API Key** | Generate new key with a name                    |
| **Active Keys**    | View all keys with usage stats                  |
| **Revoke Key**     | Disable an API key                              |

**Key Information:**

* Key name
* Key ID
* Created date
* Last used date
* Usage count

<Warning>
  API keys provide full access to your Business Unit data. Never share keys publicly or commit them to version control.
</Warning>

### Activity

View system activity and audit logs.

| Setting            | Description                                    |
| ------------------ | ---------------------------------------------- |
| **Activity Log**   | All actions taken in the Business Unit         |
| **Filter by User** | View actions by specific team member           |
| **Filter by Type** | Filter by action type (create, update, delete) |

***

## Industry Presets

When creating a new Business Unit, choose from industry presets that configure default settings:

| Industry        | ID Prefix | Default Contract | Buyout Method              |
| --------------- | --------- | ---------------- | -------------------------- |
| **Electronics** | ELE       | 24 months        | Remaining + 50% RRP        |
| **Furniture**   | FUR       | 12 months        | \$500 flat                 |
| **Mobility**    | MOB       | 12 months        | Remaining + 40% RRP        |
| **Baby & Kids** | BAB       | 6 months         | Remaining months           |
| **Appliances**  | APP       | 12 months        | Remaining + 45% RRP        |
| **Medical**     | MED       | 6 months         | \$500 flat (no fee return) |

Each preset configures:

* ID prefix
* Available contract lengths
* Extension options
* Buyout calculation
* Early return policy
* Pricing economics

***

## Creating a Test Business Unit

Before going live, create a test Business Unit to configure settings without affecting production data.

<Steps>
  <Step title="Create Business Unit">
    Go to Settings → Organization, click **New Business Unit**, name it "Test" or "Staging"
  </Step>

  <Step title="Configure Settings">
    Set up products, pricing, and all settings in your test environment
  </Step>

  <Step title="Create Production Business Unit">
    When ready, create your production Business Unit
  </Step>

  <Step title="Copy Settings">
    Use the **Copy Settings** option to copy configuration from your test Business Unit
  </Step>
</Steps>

<Tip>
  Keep your test Business Unit active for ongoing testing. Use it to verify new products, pricing changes, or workflow updates before applying to production.
</Tip>

***

## Quick Reference

### Settings by Role

| Role       | Access Level                                |
| ---------- | ------------------------------------------- |
| **Owner**  | All organization and Business Unit settings |
| **Admin**  | All Business Unit settings                  |
| **Member** | View-only access to settings                |

### Settings Navigation

| Group             | Sections                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Organization**  | Organization, Plan & Billing, Security                                                                             |
| **Business Unit** | General, Localization, Taxes                                                                                       |
| **Platform**      | Features, Payments, Checkout, Timeline, E-Commerce                                                                 |
| **Configuration** | Subscriptions, Pricing, Pricing Presets, Catalog, Order Forms, Custom Fields, Addresses, Contracts, Asset Workflow |
| **System**        | API Keys, Activity                                                                                                 |

### Common Tasks

| Task                       | Location               |
| -------------------------- | ---------------------- |
| Change Business Unit name  | General                |
| Set timezone               | Localization           |
| Configure VAT              | Taxes                  |
| Enable contract generation | Features → Files       |
| Set billing cycle          | Payments               |
| Configure buyout pricing   | Subscriptions → Buyout |
| Add contract lengths       | Pricing                |
| Create product categories  | Catalog                |
| Add custom customer fields | Custom Fields          |
| Generate API key           | API Keys               |
