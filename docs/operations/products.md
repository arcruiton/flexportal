> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Products

> Create and manage products in your catalog

Products are the items in your catalog available for subscription. Each product can have multiple variants (like color or storage size) with different pricing based on contract length.

## Product Structure

A product consists of:

* **Product** - The model or catalog item (e.g., "iPhone 16 Pro 256GB")
* **Variants** - Different configurations (e.g., "Black", "Natural Titanium")
* **Pricing** - Monthly rates by contract length (6, 12, 24, 36 months)

<Info>
  FlexPortal supports subscriptions for any physical product type.
</Info>

## Creating a New Product

FlexPortal supports subscriptions for any physical product - electronics, furniture, mobility, baby gear, appliances, medical equipment, and more.

1. Navigate to **Products** in the left sidebar
2. Click **New Product** in the top right
3. Fill in the product details:
   * **Name** - Product model name (e.g., "MacBook Air 13")
   * **SKU** - Stock keeping unit for internal tracking
   * **Category** - Product category (Electronics, Furniture, etc.)
   * **Brand** - Manufacturer or brand name
   * **Specification** - Technical details or key features
4. Click **Save**

<Info>
  Use clear, descriptive names. Customers will see these when browsing your catalog.
</Info>

## Adding Product Variants

Variants represent different configurations of the same product, like color, storage size, or condition grade.

1. Open the product you want to add variants to
2. Scroll to the **Variants** section
3. Click **Add Variant**
4. Enter variant details:
   * **Variant name** - Descriptive name (e.g., "512GB Space Gray")
   * **Grade** - Condition rating (A, B, C for refurbished products)
5. Click **Save**

<Tip>
  For new products, use Grade A. For refurbished products, use grades to indicate condition and price accordingly.
</Tip>

## Setting Pricing for Contract Lengths

Each variant can have different pricing for different contract lengths. Shorter contracts typically have higher monthly rates.

1. Open a product variant
2. Scroll to the **Pricing** section
3. Click **Add Pricing Tier**
4. Configure the pricing:
   * **Contract length** - Duration in months (6, 12, 24, 36)
   * **Monthly price** - Amount customer pays per month
5. Repeat for additional contract lengths
6. Click **Save**

### Pricing Strategy

Common pricing structures across different industries:

**Electronics (MacBook Pro 14"):**

| Contract Length | Monthly Price | Total Collected |
| --------------- | ------------- | --------------- |
| 6 months        | \$149         | \$894           |
| 12 months       | \$89          | \$1,068         |
| 24 months       | \$49          | \$1,176         |

**Mobility (Urban E-Bike):**

| Contract Length | Monthly Price | Total Collected |
| --------------- | ------------- | --------------- |
| 6 months        | €99           | €594            |
| 12 months       | €59           | €708            |
| 24 months       | €35           | €840            |

**Furniture (Ergonomic Office Chair):**

| Contract Length | Monthly Price | Total Collected |
| --------------- | ------------- | --------------- |
| 6 months        | €49           | €294            |
| 12 months       | €29           | €348            |
| 24 months       | €19           | €456            |

Longer contracts mean lower monthly rates but higher total income collected.

<Warning>
  Always ensure your pricing covers the asset acquisition cost plus operational expenses before reaching 100% cost recovery.
</Warning>

## Product SKUs and Organization

SKUs help you organize and track products internally. While customers don't see SKUs, they're essential for inventory management and reporting.

### SKU Best Practices

* Use consistent naming patterns (e.g., `MBP-14-M3-512-SG` for MacBook Pro 14" M3 512GB Space Gray)
* Include key attributes in the SKU
* Keep SKUs short but descriptive
* Use hyphens or underscores for readability

### Example SKU Structure

```
BRAND-MODEL-VARIANT
MBP-14-512GB-SG  (MacBook Pro 14" 512GB Space Gray)
IP16-256-BLK     (iPhone 16 256GB Black)
ECB-250W-BLK     (Urban E-Bike 250W Black)
EOC-PRO-BLK      (Ergonomic Office Chair Pro Black)
PS-DLX-GRY       (Premium Stroller Deluxe Gray)
```

## Managing Product Status

Products can be active (available for new subscriptions) or discontinued (hidden from new orders while existing subscriptions continue).

### Making a Product Active

1. Open the product
2. Toggle **Status** to **Active**
3. Click **Save**

Active products appear in the order creation dropdown and are available via API.

### Discontinuing a Product

1. Open the product
2. Toggle **Status** to **Discontinued**
3. Click **Save**

<Info>
  Discontinued products remain in the system and existing subscriptions continue running. You can reactivate discontinued products at any time.
</Info>

## Editing Existing Products

1. Navigate to **Products**
2. Click on the product you want to edit
3. Make your changes to:
   * Product details (name, SKU, brand, specifications)
   * Variants
   * Pricing tiers
4. Click **Save**

<Warning>
  Changing pricing on a product does not affect existing subscriptions. Only new orders will use the updated pricing.
</Warning>

## Product Details and Specifications

Add detailed specifications to help customers make informed decisions. This appears in order confirmations and subscription details.

Include details like:

* Physical dimensions and weight
* Technical specifications
* What's included in the box
* Special features or capabilities
* Warranty information

## Deleting Products

Products with existing subscriptions cannot be deleted. Instead, set them to Discontinued status.

For products with no subscriptions:

1. Open the product
2. Scroll to the bottom
3. Click **Delete Product**
4. Confirm deletion

<Warning>
  Deletion is permanent and cannot be undone. Ensure the product has no associated orders or subscriptions.
</Warning>

## Product Search and Filtering

Use the search bar at the top of the Products page to find products by:

* Product name
* SKU
* Brand
* Category

Filter products by:

* **Status** - Active or Discontinued
* **Category** - Electronics, Furniture, etc.
* **Brand** - Manufacturer

## Best Practices

### Naming Conventions

* Use clear, customer-facing names for products
* Include key differentiators in the product name
* Keep variant names concise

### Pricing Guidelines

* Set pricing that achieves cost recovery within the contract period
* Offer multiple contract lengths to give customers flexibility
* Consider seasonal pricing adjustments for certain products

### Product Organization

* Group related products by category
* Use consistent SKU formats
* Add detailed specifications for complex products
* Keep product count manageable by using variants instead of creating duplicate products

## Common Scenarios

### Launching a New Product Line

1. Create the base product with all core details
2. Add variants for each configuration (color, storage, etc.)
3. Set pricing tiers for each variant
4. Set status to Active
5. Test by creating a sample order

### Updating Prices for Existing Products

1. Open the product
2. Navigate to the variant
3. Edit the pricing tier
4. Save changes

New orders will use the updated pricing. Existing subscriptions remain at their original price.

### Managing Seasonal Products

For products available only during certain times of year:

1. Set to Active during the season
2. Set to Discontinued when out of season
3. Reactivate when the season returns

Subscription billing continues regardless of product status.
