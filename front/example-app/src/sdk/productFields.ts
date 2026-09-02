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

// `configurable_attributes` names the axes a product varies on. It reaches us in FOUR shapes, and
// this function is the only place in the app that knows that:
//
//   ["fashion_color","fashion_size"]        the raw _source, on the PDP — a real array
//   "[\"fashion_color\",\"fashion_size\"]"  GraphQL, 2+ axes  — JSON-encoded into a string
//   "fashion_size"                          GraphQL, 1 axis   — collapsed to a bare string
//   null                                    GraphQL, 0 axes   — the empty array drops out
//
// All four measured on com_fr after a fixtures load: 66 products, 4, and 15 respectively.
//
// The collapsing is Gally's, not ours: `keyword` and `text` source fields both resolve to
// TextAttribute, whose getSanitizedData() returns current($value) for a one-element array and
// json_encode($value) for anything longer, and its GraphQL type is String. No source-field type
// emits a list of scalars, so there is no cleaner field to ask for.
export function parseAxisCodes(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((c): c is string => typeof c === 'string');
  if (typeof value !== 'string' || value === '') return [];
  if (value.startsWith('[')) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((c): c is string => typeof c === 'string') : [];
    } catch {
      return [];
    }
  }
  return [value];
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
  // `=== true` is load-bearing, not style. In the raw `_source` (which the PDP reads, because
  // PRODUCT_DETAIL_FIELDS asks for `source`) an unset boolean attribute is `[]`, not `false` —
  // and `[]` is truthy, so a `||` read badges every product as new. Same reason as `sale` below.
  const isNew = s.new === true;
  // `sale` is the merchandising flag the catalogue sets; `is_discounted` is the arithmetic on
  // the price row. They describe the same products in the sample data on purpose, but reading
  // both means the badge is still right on a catalogue that only maintains one of them.
  const isOnSale = s.sale === true || isDiscounted;
  // "Pure" is not an attribute — it is what a SINGLE entry in fashion_material means. Derived
  // rather than flagged so it needs no data of its own and no hardcoded list of material codes
  // in the storefront, and so the label arrives already translated by the catalogue
  // ("Cashmere" on com_en, "Coton bio" on com_fr).
  const materials = Array.isArray(s.fashion_material) ? s.fashion_material : [];
  const pureMaterial = materials.length === 1 && materials[0]?.label ? String(materials[0].label) : null;
  const typeId = s.type_id || 'simple';
  const description = Array.isArray(s.description) ? s.description[0] : s.description || '';
  // The fallback deliberately leaves `qty` out rather than setting it to 0: a document with no
  // stock object at all is "unknown", not "zero units", and isAvailable() treats those apart.
  const stock = s.stock || { status: true };
  return {
    name, sku, image, price, originalPrice, isDiscounted, isNew, isOnSale, pureMaterial,
    typeId, description, stock,
    available: isAvailable(stock),
    // The attribute bag this product was read from — `_source` on the PDP, the projected
    // collection row on a listing. getVariantAxes() needs it whole, because which keys matter
    // is itself data (`configurable_attributes` names them). The two shapes are interchangeable
    // for that purpose: a row projected with `fashion_color { label value }` looks exactly like
    // the `_source` it came from.
    attributes: s as Record<string, any>,
  };
}

export interface ProductBadge {
  /** Key in the `product` i18n namespace. */
  key: string;
  /** Modifier suffix on `.product-card-badge`; also the React key. */
  variant: 'new' | 'sale' | 'material';
  /** Interpolation values for the i18n key. */
  params?: Record<string, string>;
}

// The badges overlaid on a product picture, **most important first**. It takes the already-derived
// fields rather than the raw product so the card does not map the same document twice, and lives
// here rather than in ProductCard.tsx for the reason at the top of this file: the server-rendered
// shells must be able to reach it too.
//
// Every badge here is MERCHANDISING — a reason to look at the product. Availability is
// deliberately not among them: both surfaces that draw these badges already state it in the place
// the visitor acts on it (the disabled add-to-cart button on the card, and the stock line plus
// that same button on the PDP), and a badge saying it a second time only crowded the picture.
//
// **The order is the priority, and callers truncate rather than re-sort.** A grid card shows only
// the first (see ProductCard.tsx); the PDP has room and shows all of them. Keeping one ordered
// list means the badge a card shows is always the same one the PDP leads with — a visitor who
// clicked a "Sale" card never lands on a page headed by something else.
//
// Sale outranks everything: it is the only badge that changes what the product costs today, and
// it decays (the promotion ends), so it is the one worth spending a card's single slot on. New is
// next — still a reason to click, but it says nothing about the offer. Material is last: it is a
// fact about the product rather than a reason to hurry, and it is the badge most products qualify
// for, so letting it win a slot would drown out the two that are actually merchandised.
export function getProductBadges(fields: ReturnType<typeof getProductFields>): ProductBadge[] {
  const badges: ProductBadge[] = [];
  if (fields.isOnSale) badges.push({ key: 'card.onSale', variant: 'sale' });
  if (fields.isNew) badges.push({ key: 'card.new', variant: 'new' });
  if (fields.pureMaterial) {
    badges.push({ key: 'card.pureMaterial', variant: 'material', params: { material: fields.pureMaterial } });
  }
  return badges;
}
