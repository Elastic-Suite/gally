'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../hooks/useSearch';
import { useTracking } from '../hooks/useTracking';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
import { useAddedFlash } from '../hooks/useAddedFlash';
import ProductSlider from '../components/ProductSlider';
import { getProductFields } from '../components/ProductCard';
import { getProductBadges } from '../sdk/productFields';
import { ProductPageSkeleton } from '../components/skeletons';
import Breadcrumb from '../components/Breadcrumb';
import { productCategoryTrail } from '../sdk/categoryTree';
import VariantSelector, { getVariantAxes } from '../components/VariantSelector';
import { PRODUCT_DETAIL_FIELDS } from '../sdk/fields';

// `initialProduct` is the raw search document the Server Component already fetched for
// this SKU. When it is present the page renders complete on the first pass — no
// skeleton, no post-hydration refetch — which is what makes the HTML crawlable.
export default function ProductPage({ initialProduct }: { initialProduct?: any } = {}) {
  const { t } = useTranslation('product');
  const params = useParams();
  const sku = Array.isArray(params.sku) ? params.sku[0] : params.sku;
  const { formatPrice, selectedLocalizedCatalog, categories } = useCatalog();
  const { addToCart } = useCart();
  // Confirms in place like the grid card does. No `addedFlash` glow here — that
  // animation outlines a card, and there is no card on this layout; the button
  // holding a success state is the whole feedback.
  const { addedKey, flash } = useAddedFlash();
  const { trackProductView } = useTracking();
  // Axis code → chosen option value. Starts empty: nothing is pre-selected, because the index
  // holds no (colour × size) → child mapping, so a default would be a claim about a variant
  // this app cannot actually resolve. See specs/feature-configurable-option-selection.md.
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Look up this specific product by exact SKU match. searchQuery is still
  // passed (rather than left empty) purely to make useSearch pick product_search
  // over product_catalog, which 400s without a currentCategoryId — the equalFilter
  // below is what actually guarantees we get this exact product, not the query text.
  const { products, loading } = useSearch({
    searchQuery: sku,
    filters: sku ? [{ sku: { eq: sku } }] : undefined,
    pageSize: 1,
    // Must match what fetchProductBySku asked for, or this refetch would drop the raw `source`
    // the server pass rendered the option axes from.
    selectedFields: PRODUCT_DETAIL_FIELDS,
    initialData: initialProduct
      ? { products: [initialProduct], total: 1, pageCount: 1, aggregations: [] }
      : undefined,
  });

  const p = products[0] ? getProductFields(products[0]) : null;

  // The generated catalogs ship square 600x600 images, so they fill the square frame exactly.
  // The older Venia/Luma set is 161x200 - letting it fill only magnifies it - so those keep the
  // 400px cap. Keyed on the media shard, which is the thing that actually differs.
  const FULL_FRAME_SHARDS = ['/l/l/', '/t/b/', '/f/i/'];
  const fillsFrame = FULL_FRAME_SHARDS.some((shard) => p?.image?.includes(shard));

  const trackedSkuRef = useRef('');

  useEffect(() => {
    // Wait for the catalog to load — the tracker rejects VIEW events fired
    // before selectedLocalizedCatalog is set (no localizedCatalogCode yet).
    if (sku && selectedLocalizedCatalog && trackedSkuRef.current !== sku) {
      trackedSkuRef.current = sku;
      trackProductView(sku);
    }
  }, [sku, selectedLocalizedCatalog, trackProductView]);

  // Recommendations — a plain catalog browse of the root category, not a search.
  // Still a placeholder for the dedicated productRecommendations GraphQL query
  // (see .agent.md's "What's Left / TODO" section) — not real recs yet.
  const rootCategory = categories.length > 0 ? categories[0] : null;
  const { products: recommendations } = useSearch({ pageSize: 8, categoryCode: rootCategory?.id });

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (!p) {
    return (
      <div className="empty-state" style={{ margin: '3rem auto' }}>
        <h3>{t('page.notFound')}</h3>
        <p>{t('page.sku', { sku })}</p>
      </div>
    );
  }

  // `source` is the raw _source, requested only on this route (PRODUCT_DETAIL_FIELDS). It is
  // where `configurable_attributes` and `type_id` live — neither is a typed field on the
  // GraphQL Product type — so without it this page cannot tell a configurable from a simple.
  const source = products[0]?.source as Record<string, any> | undefined;
  const materials = (source?.fashion_material || []) as { label: string; value: any }[];
  const badges = getProductBadges(p);
  const axes = getVariantAxes(source);

  // The labels behind the current selection, in axis order, for the cart line and its tracking
  // payload. Only what the user actually picked: no axis is pre-selected.
  const selectedLabels = axes
    .map(axis => axis.options.find(o => String(o.value) === selectedOptions[axis.code])?.label)
    .filter(Boolean);

  return (
    <div>
      <div className="page-title">
        {/* The real path down to this product, not "Home / Products / <name>": there is no
            products page to click, and the category the product sits in is the level a
            visitor actually wants to go back up to. Deepest assignment wins — see
            productCategoryTrail. Same trail the route's BreadcrumbList JSON-LD emits. */}
        <Breadcrumb
          parts={[
            ...productCategoryTrail(categories, source).map(node => ({
              name: node.name,
              href: `/category/${node.id}`,
            })),
            { name: p.name },
          ]}
        />
      </div>

      <div className="product-detail">
        <div className="product-detail-image">
          {/* The same overlay as the grid card, from the same rule — a visitor who followed a
              "New" badge into the PDP should not find it gone. Here the fields come out of the
              raw `source`, which carries `new`, `sale` and `fashion_material` just like the
              projected collection row does. */}
          {badges.length > 0 && (
            <div className="product-card-badges">
              {badges.map((badge) => (
                <span key={badge.variant} className={`product-card-badge product-card-badge--${badge.variant}`}>
                  {t(badge.key, badge.params)}
                </span>
              ))}
            </div>
          )}
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              style={
                fillsFrame
                  ? { width: '100%', height: '100%', objectFit: 'contain' }
                  : { maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }
              }
            />
          ) : (
            <span>📷 {p.name}</span>
          )}
        </div>

        <div className="product-detail-info">
          <span style={{ fontSize: '0.75rem', background: 'var(--indigo-50)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-pill)', color: 'var(--indigo-700)' }}>
            {p.typeId === 'configurable' ? t('page.type.configurable') : t('page.type.simple')}
          </span>
          <h1>{p.name}</h1>
          <div className="product-detail-brand">{t('page.sku', { sku: p.sku })}</div>
          <div className="product-detail-price">
            {p.isDiscounted && p.originalPrice && (
              <span style={{ textDecoration: 'line-through', color: 'var(--gray-400)', marginRight: '0.75rem', fontSize: '0.9em' }}>
                {formatPrice(p.originalPrice)}
              </span>
            )}
            <span style={p.isDiscounted ? { color: 'var(--coral-500)' } : {}}>
              {formatPrice(p.price)}
            </span>
          </div>

          {p.description && (
            <div
              style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: p.description }}
            />
          )}

          {materials.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <strong>{t('page.material')}</strong> {materials.map(m => m.label).join(', ')}
            </div>
          )}

          <VariantSelector
            axes={axes}
            selected={selectedOptions}
            onSelect={(code, value) => setSelectedOptions(prev => ({ ...prev, [code]: value }))}
          />


          <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
            {/* Three states, all driven by `available` (see ../sdk/productFields.ts) so the line,
                the button below and the JSON-LD offer cannot disagree: a real quantity gets the
                count, an unknown quantity gets the status alone, and `status: true` with `qty: 0`
                — what Gally reports for every product with children — reads as out of stock. */}
            {p.available
              ? <span style={{ color: 'var(--green-600, #43a047)' }}>
                  {typeof p.stock.qty === 'number'
                    ? t('page.inStock', { count: p.stock.qty })
                    : t('page.inStockNoCount')}
                </span>
              : <span style={{ color: 'var(--coral-500)' }}>{t('page.outOfStockLong')}</span>
            }
          </div>

          <div className="product-detail-actions">
            <button
              className={`btn btn-primary btn-lg ${addedKey === p.sku ? 'added' : ''}`}
              disabled={!p.available}
              onClick={() => {
                addToCart({
                  sku: p.sku,
                  name: p.name,
                  price: p.price,
                  image: p.image,
                  variant: selectedLabels.length ? selectedLabels.join(' / ') : undefined,
                  // No childSku. The index carries `children.sku` but no per-child attribute
                  // values, so a chosen combination cannot be resolved to a real child — and
                  // the parent SKU is the only honest thing to report. CartContext falls back
                  // to `item.sku`, so the add_to_cart payload's child_sku is the parent.
                });
                flash(p.sku);
              }}
            >
              {!p.available
                ? t('card.outOfStock')
                : addedKey === p.sku
                  ? t('card.added')
                  : t('page.addToCart')}
            </button>
            <button className="btn btn-outline btn-lg">{t('page.wishlist')}</button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="recommendations">
          <ProductSlider
            title={t('page.recommendations')}
            products={recommendations.filter((r: any) => (r.source?.sku || r.sku) !== sku).slice(0, 6)}
          />
        </section>
      )}
    </div>
  );
}
