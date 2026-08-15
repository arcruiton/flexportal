> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Update Subscription Notes

> Updates the notes field on a subscription.

## Overview

Update the notes field on a subscription. Use this to add internal comments, support ticket references, or any relevant information about the subscription.

## Request Fields

| Field   | Required | Description                     |
| ------- | -------- | ------------------------------- |
| `notes` | Yes      | Note text (max 5000 characters) |

## Example Request

```json theme={null}
{
  "notes": "Customer prefers email communication only. Delivery scheduled for morning slots."
}
```

## Response Fields

| Field      | Description                 |
| ---------- | --------------------------- |
| `success`  | Always `true` on success    |
| `message`  | Confirmation message        |
| `rentalId` | The updated subscription ID |

## Common Use Cases

<CardGroup cols={2}>
  <Card title="Support Tickets" icon="ticket">
    Reference support interactions and resolutions
  </Card>

  <Card title="Customer Preferences" icon="user">
    Record delivery, communication, or service preferences
  </Card>

  <Card title="Internal Notes" icon="note-sticky">
    Add context for team members handling the account
  </Card>

  <Card title="Issue Tracking" icon="flag">
    Document known issues or special handling requirements
  </Card>
</CardGroup>

## Example: Append to Existing Notes

Notes are replaced, not appended. To preserve existing notes:

```javascript theme={null}
async function appendNote(subscriptionId, newNote) {
  const subscription = await getSubscription(subscriptionId);
  const timestamp = new Date().toISOString().split('T')[0];

  const updatedNotes = subscription.notes
    ? `${subscription.notes}\n\n[${timestamp}] ${newNote}`
    : `[${timestamp}] ${newNote}`;

  return await updateSubscriptionNotes(subscriptionId, {
    notes: updatedNotes
  });
}
```

## Example: Log Support Interaction

```javascript theme={null}
async function logSupportInteraction(subscriptionId, ticketId, summary) {
  const subscription = await getSubscription(subscriptionId);
  const entry = `Support ticket #${ticketId}: ${summary}`;

  const notes = subscription.notes
    ? `${subscription.notes}\n${entry}`
    : entry;

  await updateSubscriptionNotes(subscriptionId, { notes });
}
```

## Example: Bulk Update Notes

```javascript theme={null}
async function addNoteToActiveSubscriptions(customerId, note) {
  const { subscriptions } = await listSubscriptions({
    customerId,
    status: 'active'
  });

  for (const sub of subscriptions) {
    const updatedNotes = sub.notes
      ? `${sub.notes}\n${note}`
      : note;

    await updateSubscriptionNotes(sub.subscriptionId, {
      notes: updatedNotes
    });
  }

  return { updated: subscriptions.length };
}
```

## Notes Best Practices

* **Be concise** but include relevant details
* **Use timestamps** when logging events
* **Include references** (ticket IDs, order numbers)
* **Avoid sensitive data** (use separate secure storage for PII)

## Error Handling

| Error Code         | Cause                        | Solution               |
| ------------------ | ---------------------------- | ---------------------- |
| `NOT_FOUND`        | Subscription doesn't exist   | Verify subscription ID |
| `VALIDATION_ERROR` | Notes exceed 5000 characters | Shorten the note text  |

## Related Endpoints

* [Get Subscription](/api-reference/subscriptions/get) - View current notes
* [List Subscriptions](/api-reference/subscriptions/list) - Find subscriptions


## OpenAPI

````yaml PATCH /v1/subscriptions/{subscriptionId}/notes
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
  /v1/subscriptions/{subscriptionId}/notes:
    patch:
      tags:
        - Subscriptions
      summary: Update subscription notes
      description: Updates the notes field on a subscription.
      operationId: updateSubscriptionNotes
      parameters:
        - schema:
            type: string
            description: The subscription ID
          required: true
          name: subscriptionId
          in: path
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
                notes:
                  type: string
                  maxLength: 5000
              required:
                - notes
      responses:
        '200':
          description: Notes updated
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
                required:
                  - success
                  - message
                  - rentalId
        '404':
          description: Subscription not found
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