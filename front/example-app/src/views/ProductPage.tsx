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
import { ProductPageSkeleton } from '../components/skeletons';

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
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Look up this specific product by exact SKU match. searchQuery is still
  // passed (rather than left empty) purely to make useSearch pick product_search
  // over product_catalog, which 400s without a currentCategoryId — the equalFilter
  // below is what actually guarantees we get this exact product, not the query text.
  const { products, loading } = useSearch({
    searchQuery: sku,
    filters: sku ? [{ sku: { eq: sku } }] : undefined,
    pageSize: 1,
    initialData: initialProduct
      ? { products: [initialProduct], total: 1, pageCount: 1, aggregations: [] }
      : undefined,
  });

  const p = products[0] ? getProductFields(products[0]) : null;

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

  const colors = (products[0]?.source?.fashion_color || []) as { label: string; value: any }[];
  const materials = (products[0]?.source?.fashion_material || []) as { label: string; value: any }[];
  const hasVariants = colors.length > 0;

  return (
    <div>
      <div className="page-title">
        <div className="breadcrumb">{t('page.breadcrumb', { name: p.name })}</div>
      </div>

      <div className="product-detail">
        <div className="product-detail-image">
          {p.image ? (
            <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
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

          {hasVariants && (
            <div className="product-variants">
              <h4>{t('page.color')}</h4>
              <div className="variant-options">
                {colors.map((c, i) => (
                  <div
                    key={c.value}
                    className={`variant-option ${i === selectedVariant ? 'selected' : ''}`}
                    onClick={() => setSelectedVariant(i)}
                  >
                    {c.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
            {p.stock.status
              ? <span style={{ color: 'var(--green-600, #43a047)' }}>{t('page.inStock', { count: p.stock.qty })}</span>
              : <span style={{ color: 'var(--coral-500)' }}>{t('page.outOfStockLong')}</span>
            }
          </div>

          <div className="product-detail-actions">
            <button
              className={`btn btn-primary btn-lg ${addedKey === p.sku ? 'added' : ''}`}
              disabled={!p.stock.status}
              onClick={() => {
                addToCart({
                  sku: p.sku,
                  name: p.name,
                  price: p.price,
                  image: p.image,
                  variant: hasVariants ? colors[selectedVariant]?.label : undefined,
                  childSku: p.typeId === 'configurable' ? `${p.sku}-${selectedVariant}` : p.sku,
                });
                flash(p.sku);
              }}
            >
              {!p.stock.status
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
