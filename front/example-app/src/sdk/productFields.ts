import { MEDIA_BASE_URL } from './index';

// Lives outside ProductCard.tsx because that file is a Client Component: importing a
// plain function out of a 'use client' module into a Server Component gives you a
// client reference, and calling it on the server throws. The server-rendered product
// shells and the client card must agree on this mapping, so it belongs to neither side.
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
  const stock = s.stock || { status: true, qty: 0 };
  return { name, sku, image, price, originalPrice, isDiscounted, isNew, typeId, description, stock };
}
