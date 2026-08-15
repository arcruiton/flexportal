> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# API Overview

> Authentication, headers, pagination, and everything you need to integrate with FlexPortal

## Authentication

FlexPortal uses Bearer token authentication. Include your API key in the `Authorization` header of every request:

```bash theme={null}
curl -X GET "https://api-eu.flexportal.io/v1/orders" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Tenant-ID: YOUR_BUSINESS_UNIT_ID" \
  -H "Content-Type: application/json"
```

<Info>
  API keys are created in the [Dashboard](https://eu.flexportal.io) under **Settings → API Keys**. Each key is scoped to your organization with configurable permissions.
</Info>

## Required Headers

Every API request must include these headers:

| Header          | Required                 | Description                                                     |
| --------------- | ------------------------ | --------------------------------------------------------------- |
| `Authorization` | Yes                      | `Bearer YOUR_API_KEY`                                           |
| `Tenant-ID`     | Yes                      | Your Business Unit ID (found in Dashboard → Settings → General) |
| `Content-Type`  | Yes (for POST/PUT/PATCH) | `application/json`                                              |

## Base URLs

FlexPortal is deployed across multiple regions. Use the base URL closest to your customers:

| Region        | Base URL                          |
| ------------- | --------------------------------- |
| Europe        | `https://api-eu.flexportal.io`    |
| United States | `https://api-us.flexportal.io`    |
| Qatar         | `https://api-qatar.flexportal.io` |

<Warning>
  Data is region-specific. Orders created in the EU region are not visible from US endpoints. Choose your region during onboarding and use it consistently.
</Warning>

## Rate Limits

| Tier       | Requests per minute |
| ---------- | ------------------- |
| Starter    | 100                 |
| Growth     | Unlimited\*         |
| Enterprise | Unlimited\*         |

\*Fair use policy with abuse protection. Sustained high-volume usage may trigger temporary throttling.

When rate limited, you'll receive a `429 Too Many Requests` response with a `Retry-After` header indicating when to retry.

## Pagination

List endpoints use **cursor-based pagination** for reliable, consistent results even when data changes between requests.

### Request Parameters

| Parameter    | Type    | Default     | Description                                    |
| ------------ | ------- | ----------- | ---------------------------------------------- |
| `limit`      | integer | 50          | Items per page (max: 100)                      |
| `startAfter` | string  | —           | Cursor from previous response to get next page |
| `sortBy`     | string  | `createdAt` | Field to sort by (varies per endpoint)         |
| `sortDir`    | string  | `desc`      | Sort direction: `asc` or `desc`                |

### Response Structure

```json theme={null}
{
  "orders": [...],
  "count": 50,
  "limit": 50,
  "hasMore": true,
  "nextCursor": "ord_abc123xyz"
}
```

### Iterating Through Pages

```javascript theme={null}
let cursor = null;
let allOrders = [];

do {
  const params = new URLSearchParams({ limit: '100' });
  if (cursor) params.set('startAfter', cursor);

  const response = await fetch(
    `https://api-eu.flexportal.io/v1/orders?${params}`,
    { headers: { 'Authorization': 'Bearer YOUR_API_KEY', 'Tenant-ID': 'YOUR_TENANT' } }
  );
  const data = await response.json();

  allOrders.push(...data.orders);
  cursor = data.nextCursor;
} while (cursor);
```

<Tip>
  Use `nextCursor` value as `startAfter` for the next request. When `hasMore` is `false` or `nextCursor` is `null`, you've reached the end.
</Tip>

## Request Format

All request bodies must be valid JSON:

```bash theme={null}
Content-Type: application/json
```

## Response Format

### Success Responses

All successful responses include relevant data and metadata:

```json theme={null}
{
  "success": true,
  "message": "Order created successfully",
  "orderId": "ord_abc123",
  "order": { ... }
}
```

For list endpoints:

```json theme={null}
{
  "orders": [...],
  "count": 25,
  "limit": 50,
  "hasMore": false,
  "nextCursor": null
}
```

### Error Responses

Errors follow a consistent structure with machine-readable codes and human-friendly messages:

```json theme={null}
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      {
        "path": "customer.email",
        "message": "Invalid email format",
        "code": "invalid_string"
      }
    ]
  }
}
```

## HTTP Status Codes

| Code  | Name              | Description                                       |
| ----- | ----------------- | ------------------------------------------------- |
| `200` | OK                | Request succeeded                                 |
| `201` | Created           | Resource created successfully                     |
| `400` | Bad Request       | Invalid request syntax or parameters              |
| `401` | Unauthorized      | Missing or invalid API key                        |
| `403` | Forbidden         | Valid API key but insufficient permissions        |
| `404` | Not Found         | Resource doesn't exist                            |
| `409` | Conflict          | Resource conflict (e.g., duplicate serial number) |
| `422` | Unprocessable     | Validation failed                                 |
| `429` | Too Many Requests | Rate limit exceeded                               |
| `500` | Internal Error    | Server error (contact support)                    |

## Error Codes Reference

Common error codes you may encounter:

| Code                       | HTTP Status | Description                                  | Resolution                                         |
| -------------------------- | ----------- | -------------------------------------------- | -------------------------------------------------- |
| `AUTH_REQUIRED`            | 401         | Missing Authorization header                 | Add `Authorization: Bearer YOUR_API_KEY` header    |
| `INVALID_TOKEN`            | 401         | API key is invalid or expired                | Generate a new API key in Dashboard                |
| `NO_TENANT_ACCESS`         | 403         | Missing or invalid Tenant-ID header          | Add valid `Tenant-ID` header                       |
| `INSUFFICIENT_PERMISSIONS` | 403         | API key lacks required permissions           | Update API key permissions in Dashboard            |
| `NOT_FOUND`                | 404         | Resource doesn't exist                       | Verify the ID and tenant context                   |
| `VALIDATION_ERROR`         | 400         | Request body failed validation               | Check `details` array for specific field errors    |
| `ASSET_EXISTS`             | 409         | Asset with serial number already exists      | Use a unique serial number or update existing      |
| `VARIANT_IN_USE`           | 409         | Cannot deactivate variant with active orders | Complete or cancel orders using this variant first |
| `ORDER_NOT_CANCELLABLE`    | 400         | Order status doesn't allow cancellation      | Only pending/confirmed orders can be cancelled     |

## Core Resources

FlexPortal's API is organized around these key resources:

| Resource           | Description                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **Products**       | Items in your catalog available for subscription, with variants for different configurations |
| **Customers**      | End users who subscribe to products (individuals or businesses)                              |
| **Orders**         | Subscription checkout transactions containing items, addresses, and payment info             |
| **Subscriptions**  | Active subscription contracts tracking billing, payments, and lifecycle events               |
| **Assets**         | Individual physical units tracked by serial number                                           |
| **Payments**       | Scheduled and completed billing transactions                                                 |
| **Billing Groups** | B2B feature for consolidating multiple subscriptions into single invoices                    |
| **Files**          | Documents like contracts, invoices, and uploaded files                                       |

<CardGroup cols={2}>
  <Card title="Products" icon="box" href="/api-reference/products/list">
    Create and manage your product catalog with variants and pricing
  </Card>

  <Card title="Orders" icon="shopping-cart" href="/api-reference/orders/list">
    Process subscription orders and track fulfillment
  </Card>

  <Card title="Subscriptions" icon="repeat" href="/api-reference/subscriptions/list">
    Manage active subscriptions, extensions, upgrades, and buyouts
  </Card>

  <Card title="Payments" icon="credit-card" href="/api-reference/payments/list">
    Track and manage scheduled billing payments
  </Card>
</CardGroup>

## Filtering

Most list endpoints support filtering by key fields. Pass filter values as query parameters:

```bash theme={null}
# Get all pending orders for a specific customer
GET /v1/orders?status=pending&customerId=cust_abc123

# Get all active subscriptions
GET /v1/subscriptions?status=active

# Get available assets of a specific SKU
GET /v1/assets?status=available&sku=LAPTOP-PRO-16
```

### Custom Field Filtering (Orders)

If you've configured custom fields, filter by them using the `customField_` prefix:

```bash theme={null}
GET /v1/orders?customField_siebelId=12345
GET /v1/orders?customField_vendorCode=ABC
```

## Idempotency

For operations that create resources, FlexPortal uses natural idempotency keys:

* **Orders**: Customer email + items combination within a short window
* **Assets**: Serial number (unique per tenant)
* **Payments**: Billing period + subscription ID

<Info>
  If you need to retry a failed request, it's safe to do so. Duplicate create requests will return the existing resource rather than creating duplicates.
</Info>

## Webhooks

FlexPortal can send real-time notifications for key events. Configure webhook endpoints in the Dashboard under **Settings → Webhooks**.

### Available Events

| Event                   | Description                                  |
| ----------------------- | -------------------------------------------- |
| `order.created`         | New order submitted                          |
| `order.fulfilled`       | All items in order have active subscriptions |
| `subscription.created`  | New subscription activated                   |
| `subscription.extended` | Subscription period extended                 |
| `subscription.upgraded` | Customer upgraded to different product       |
| `subscription.ended`    | Subscription completed or cancelled          |
| `payment.scheduled`     | New payment scheduled                        |
| `payment.succeeded`     | Payment collected successfully               |
| `payment.failed`        | Payment attempt failed                       |
| `asset.assigned`        | Asset linked to subscription                 |
| `asset.returned`        | Asset returned from subscription             |

### Webhook Payload

```json theme={null}
{
  "event": "subscription.created",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "subscriptionId": "sub_abc123",
    "customerId": "cust_xyz789",
    "orderId": "ord_def456",
    ...
  }
}
```

## SDKs & Libraries

Official SDKs are coming soon. In the meantime, you can use any HTTP client to interact with the API. See our [Quickstart Guide](/quickstart) for examples in various languages.

## Need Help?

* **API Issues**: Contact [support@flexportal.io](mailto:support@flexportal.io)
* **Dashboard**: [eu.flexportal.io](https://eu.flexportal.io)
* **Website**: [www.flexportal.io](https://www.flexportal.io)
