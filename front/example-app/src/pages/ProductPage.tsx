import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { useTracking } from '../hooks/useTracking';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
import ProductSlider from '../components/ProductSlider';
import { getProductFields } from '../components/ProductCard';

export default function ProductPage() {
  const { sku } = useParams<{ sku: string }>();
  const { currencySymbol, selectedLocalizedCatalog, categories } = useCatalog();
  const { addToCart } = useCart();
  const { trackProductView } = useTracking();
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Search for this specific product by SKU
  const { products, loading } = useSearch({ searchQuery: sku, pageSize: 5 });

  // Find the matching product
  const rawProduct = products.find((p: any) => {
    const s = p.source || p;
    return s.sku === sku;
  }) || products[0];

  const p = rawProduct ? getProductFields(rawProduct) : null;

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
    return (
      <div>
        <div className="page-title">
          <div className="skeleton skeleton-text" style={{ width: '200px' }} />
        </div>
        <div className="product-detail">
          <div className="product-detail-image skeleton-shimmer" />
          <div className="product-detail-info">
            <div className="skeleton skeleton-text" style={{ width: '80px', height: '20px' }} />
            <div className="skeleton skeleton-text" style={{ width: '60%', height: '2rem', marginTop: '0.5rem' }} />
            <div className="skeleton skeleton-text" style={{ width: '120px', height: '14px', marginTop: '0.5rem' }} />
            <div className="skeleton skeleton-text" style={{ width: '150px', height: '1.8rem', marginTop: '1rem' }} />
            <div className="skeleton skeleton-text" style={{ width: '100%', height: '60px', marginTop: '1.5rem' }} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <div className="skeleton skeleton-btn" style={{ width: '160px' }} />
              <div className="skeleton skeleton-btn" style={{ width: '120px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="empty-state" style={{ margin: '3rem auto' }}>
        <h3>Product not found</h3>
        <p>SKU: {sku}</p>
      </div>
    );
  }

  const colors = (rawProduct?.source?.fashion_color || []) as { label: string; value: any }[];
  const materials = (rawProduct?.source?.fashion_material || []) as { label: string; value: any }[];
  const hasVariants = colors.length > 0;

  return (
    <div>
      <div className="page-title">
        <div className="breadcrumb">Home / Products / {p.name}</div>
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
            {p.typeId === 'configurable' ? 'Configurable' : 'Simple'}
          </span>
          <h1>{p.name}</h1>
          <div className="product-detail-brand">SKU: {p.sku}</div>
          <div className="product-detail-price">
            {p.isDiscounted && p.originalPrice && (
              <span style={{ textDecoration: 'line-through', color: 'var(--gray-400)', marginRight: '0.75rem', fontSize: '0.9em' }}>
                {currencySymbol}{p.originalPrice}
              </span>
            )}
            <span style={p.isDiscounted ? { color: 'var(--coral-500)' } : {}}>
              {currencySymbol}{p.price}
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
              <strong>Material:</strong> {materials.map(m => m.label).join(', ')}
            </div>
          )}

          {hasVariants && (
            <div className="product-variants">
              <h4>Color</h4>
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
              ? <span style={{ color: 'var(--green-600, #43a047)' }}>✓ In Stock ({p.stock.qty} available)</span>
              : <span style={{ color: 'var(--coral-500)' }}>✕ Out of Stock</span>
            }
          </div>

          <div className="product-detail-actions">
            <button
              className="btn btn-coral btn-lg"
              disabled={!p.stock.status}
              onClick={() => addToCart({
                sku: p.sku,
                name: p.name,
                price: p.price,
                image: p.image,
                variant: hasVariants ? colors[selectedVariant]?.label : undefined,
                childSku: p.typeId === 'configurable' ? `${p.sku}-${selectedVariant}` : p.sku,
              })}
            >
              {p.stock.status ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="btn btn-outline btn-lg">♡ Wishlist</button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="recommendations">
          <ProductSlider
            title="You May Also Like"
            products={recommendations.filter((r: any) => (r.source?.sku || r.sku) !== sku).slice(0, 6)}
          />
        </section>
      )}
    </div>
  );
}
