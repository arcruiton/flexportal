const orderVariant = { Pending: 'mut', Confirmed: 'neu', Partial: 'warn', Fulfilled: 'good', Cancelled: 'bad' };
const subscriptionVariant = { Active: 'good', Completed: 'neu', 'Bought Out': 'neu', Upgraded: 'neu', 'Early Return': 'warn', Cancelled: 'bad' };
const assetVariant = { Available: 'good', 'Rented Out': 'neu', Returned: 'warn', Sold: 'mut', Unavailable: 'bad' };
const paymentVariant = { Pending: 'warn', Paid: 'good', Failed: 'bad', Cancelled: 'mut' };
const productVariant = { Active: 'good', Discontinued: 'mut' };
const customerVariant = { Individual: 'neu', Business: 'good' };

export function variantFor(domain, status) {
  const map = { order: orderVariant, subscription: subscriptionVariant, asset: assetVariant, payment: paymentVariant, product: productVariant, customer: customerVariant }[domain];
  return map?.[status] || 'mut';
}
