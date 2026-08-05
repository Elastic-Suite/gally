import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../hooks/useSearch';
import { useTracking } from '../hooks/useTracking';
import ProductSlider from '../components/ProductSlider';
import CategoryNav from '../components/CategoryNav';
import { useCatalog } from '../contexts/CatalogContext';

export default function Homepage() {
  const { t } = useTranslation('category');
  const { trackDisplay } = useTracking();
  const { categories } = useCatalog();

  // "Trending Now" is a plain catalog browse of the root category, not a search —
  // product_catalog requires a real currentCategoryId, so use the root rather than
  // faking a product_search with a wildcard query.
  const rootCategory = categories.length > 0 ? categories[0] : null;
  const { products, loading } = useSearch({ pageSize: 8, categoryCode: rootCategory?.id });

  // Get second set of products for "New Arrivals" — use a different category if available
  const secondCategory = categories.length > 1 ? categories[1] : null;
  const newArrivals = useSearch({
    pageSize: 8,
    categoryCode: secondCategory?.id,
  });

  const trackedDisplayRef = useRef('');

  useEffect(() => {
    if (products.length > 0) {
      const key = products.map((p: any) => p.source?.sku || p.sku).join(',');
      if (trackedDisplayRef.current !== key) {
        trackedDisplayRef.current = key;
        trackDisplay(products.map((p: any, i: number) => ({ sku: p.source?.sku || p.sku, position: i })));
      }
    }
  }, [products, trackDisplay]);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <h1>{t('homepage.heroTitle')}</h1>
        <p>
          {t('homepage.heroBody')}
        </p>
        <Link to="/search?q=" className="btn btn-coral btn-lg">{t('homepage.shopDresses')}</Link>
      </section>

      {/* Category Navigation */}
      <CategoryNav />

      {/* Product Sliders */}
      {loading ? (
        <div className="product-slider">
          <div className="skeleton skeleton-text" style={{ width: '200px', height: '1.5rem', marginBottom: '1rem' }} />
          <div className="slider-track">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-card-image skeleton-shimmer" />
                <div className="skeleton-card-body">
                  <div className="skeleton skeleton-text" style={{ width: '80%' }} />
                  <div className="skeleton skeleton-text" style={{ width: '50%', marginTop: '0.5rem' }} />
                  <div className="skeleton skeleton-btn" style={{ width: '100px', marginTop: '0.75rem' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <ProductSlider products={products.slice(0, 8)} title={t('homepage.trending')} />
          {newArrivals.products.length > 0 && (
            <ProductSlider products={newArrivals.products.slice(0, 8)} title={secondCategory ? secondCategory.name : t('homepage.moreProducts')} />
          )}
        </>
      )}

      {/* CTA Section */}
      <section style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h2>{t('homepage.readyTitle')}</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
          {t('homepage.readyBody')}
        </p>
        <Link to="/vector-search" className="btn btn-primary btn-lg">{t('homepage.tryVectorSearch')}</Link>
      </section>
    </div>
  );
}
