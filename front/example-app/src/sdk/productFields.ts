import { MEDIA_BASE_URL } from './index';

// Lives outside ProductCard.tsx because that file is a Client Component: importing a
// plain function out of a 'use client' module into a Server Component gives you a
// client reference, and calling it on the server throws. The server-rendered product
// shells and the client card must agree on this mapping, so it belongs to neither side.

// The single availability rule for the whole app: the stock line, the add-to-cart buttons and
// the JSON-LD offer must never disagree, so they all read this.
//
// `status: true` with `qty: 0` is treated as UNAVAILABLE. Gally reports exactly that for every
// product that has children (72 of the 85 in `com`), because a configurable's own stock item
// holds no quantity — and there is no child stock indexed to fall back on. Showing "in stock"
// with an add-to-cart button on a product whose only quantity signal is 0 is the incoherence
// this rule removes. Once the sample data gives those parents a real quantity, they become
// available again with no code change.
//
// `qty === undefined` means *not requested* — the SDK auto-appends only `stock { status }`, so
// only the PDP (which requests `source`) knows the quantity. Absent knowledge, `status` governs;
// otherwise every listing card would read as unavailable.
export function isAvailable(stock: { status?: boolean; qty?: number } | undefined): boolean {
  if (!stock?.status) return false;
  return typeof stock.qty !== 'number' || stock.qty > 0;
}

export function getProductFields(product: any) {
  // Products from search API come with a `source` wrapper
  const s = product.source || product;
  const name = Array.isArray(s.name) ? s.name[0] : s.name || 'Product';
  const sku = s.sku || product.sku || 'unknown';
  const image = s.image ? `${MEDIA_BASE_URL}${s.image}` : '';
  const price = s.price?.[0]?.price ?? 0;
  const originalPrice = s.price?.[0]?.original_price ?? s.price?.[0]?.originalPrice;
  const isDiscounted = s.price?.[0]?.is_discounted ?? s.price?.[0]?.isDiscounted ?? false;
  const isNew = s.new || s.is_new || false;
  const typeId = s.type_id || 'simple';
  const description = Array.isArray(s.description) ? s.description[0] : s.description || '';
  // The fallback deliberately leaves `qty` out rather than setting it to 0: a document with no
  // stock object at all is "unknown", not "zero units", and isAvailable() treats those apart.
  const stock = s.stock || { status: true };
  return {
    name, sku, image, price, originalPrice, isDiscounted, isNew, typeId, description, stock,
    available: isAvailable(stock),
  };
}
