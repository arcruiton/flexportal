> ## Documentation Index
> Fetch the complete documentation index at: https://docs.flexportal.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Update Asset

## Overview

Update an asset's details, status, or location. Use this endpoint to track asset movements, record condition changes, or mark assets as unavailable.

## Common Use Cases

* **Status Changes**: Mark returned assets as available or unavailable
* **Location Tracking**: Update location when assets move between warehouses
* **Condition Updates**: Record condition after inspection or repair
* **Notes**: Add notes about asset history or issues

## Updatable Fields

| Field             | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| `status`          | `available`, `rented_out`, `returned`, `sold`, or `unavailable` |
| `location`        | Physical location                                               |
| `condition`       | Condition notes                                                 |
| `notes`           | Additional notes                                                |
| `acquisitionCost` | Update cost if needed                                           |

## Example: Mark Asset Unavailable

```json theme={null}
{
  "status": "unavailable",
  "condition": "Screen damage - needs repair",
  "notes": "Returned from sub_abc123 with damage"
}
```

## Example: Update Location

```json theme={null}
{
  "location": "Rotterdam Warehouse",
  "notes": "Transferred from Amsterdam for regional fulfillment"
}
```

## Example: Return to Available

```json theme={null}
{
  "status": "available",
  "condition": "Inspected and cleaned - Grade B",
  "location": "Amsterdam Warehouse",
  "notes": "Returned from subscription, ready for re-deployment"
}
```

## Status Management

### When to Change Status

| Current Status | New Status    | When                                         |
| -------------- | ------------- | -------------------------------------------- |
| `available`    | `rented_out`  | Automatically when subscription created      |
| `rented_out`   | `available`   | After return inspection (if no issues)       |
| `rented_out`   | `unavailable` | After return inspection (if damaged/retired) |
| `unavailable`  | `available`   | After repair/refurbishment                   |

<Info>
  Status changes to `rented_out` happen automatically when you create a subscription. You typically only need to manually set `available` or `unavailable`.
</Info>

## Processing Returns

When assets are returned from subscriptions:

```javascript theme={null}
async function processReturn(serialNumber, inspectionResult) {
  const update = {
    notes: `Returned: ${new Date().toISOString()}`
  };

  if (inspectionResult.passed) {
    update.status = 'available';
    update.condition = `Grade ${inspectionResult.grade} - Ready for redeployment`;
    update.location = 'Returns Processing - Available';
  } else {
    update.status = 'unavailable';
    update.condition = inspectionResult.issues.join(', ');
    update.location = 'Returns Processing - Repair Queue';
  }

  return await updateAsset(serialNumber, update);
}
```

## Tracking Asset History

Use notes to build a history log:

```javascript theme={null}
async function logAssetEvent(serialNumber, event) {
  const asset = await getAsset(serialNumber);

  const newNote = `[${new Date().toISOString()}] ${event}`;
  const notes = asset.notes
    ? `${asset.notes}\n${newNote}`
    : newNote;

  await updateAsset(serialNumber, { notes });
}

// Usage
await logAssetEvent('SN123', 'Returned from customer - minor scratches');
await logAssetEvent('SN123', 'Cleaned and inspected - Grade B');
await logAssetEvent('SN123', 'Reassigned to sub_xyz789');
```

## Error Handling

| Error Code       | Cause                                      | Solution                                                            |
| ---------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| `NOT_FOUND`      | Serial number doesn't exist                | Verify serial number                                                |
| `INVALID_STATUS` | Invalid status value                       | Use `available`, `rented_out`, `returned`, `sold`, or `unavailable` |
| `ASSET_IN_USE`   | Cannot change status while in subscription | End subscription first                                              |

## Related Endpoints

* [Get Asset](/api-reference/assets/get) - View current asset details
* [List Assets](/api-reference/assets/list) - Find assets to update
* [Delete Asset](/api-reference/assets/delete) - Permanently remove asset
* [Get Subscription](/api-reference/subscriptions/get) - Check if asset is in use
