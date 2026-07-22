import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { useTracking } from '../hooks/useTracking';
import ProductSlider from '../components/ProductSlider';
import CategoryNav from '../components/CategoryNav';
import { useCatalog } from '../contexts/CatalogContext';

export default function Homepage() {
  const { products, loading } = useSearch({ pageSize: 8 });
  const { trackDisplay } = useTracking();
  const { categories } = useCatalog();

  // Get second set of products for "New Arrivals" — use a different category if available
  const secondCategory = categories.length > 1 ? categories[1] : null;
  const newArrivals = useSearch({
    pageSize: 8,
    categoryCode: secondCategory?.id,
  });

  useEffect(() => {
    if (products.length > 0) {
      trackDisplay(products.map((p: any, i: number) => ({ sku: p.source?.sku || p.sku, position: i })));
    }
  }, [products, trackDisplay]);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <h1>Intelligent Search for E-commerce</h1>
        <p>
          Discover how ElasticSuite powers product discovery with AI-driven search,
          faceted navigation, and real-time recommendations.
        </p>
        <Link to="/search?q=" className="btn btn-coral btn-lg">Explore Products</Link>
      </section>

      {/* Stats Band */}
      <div className="stats-band">
        <div className="stat-card">
          <div className="stat-value coral">-40%</div>
          <div className="stat-label">No Results Pages</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">+30%</div>
          <div className="stat-label">Conversion Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">+15%</div>
          <div className="stat-label">Cart Value</div>
        </div>
        <div className="stat-card">
          <div className="stat-value coral">x2</div>
          <div className="stat-label">Merchandising Efficiency</div>
        </div>
      </div>

      {/* Category Navigation */}
      <CategoryNav />

      {/* Product Sliders */}
      {loading ? (
        <div className="loading"><div className="loading-spinner" /> Loading products…</div>
      ) : (
        <>
          <ProductSlider products={products.slice(0, 8)} title="Trending Now" />
          {newArrivals.products.length > 0 && (
            <ProductSlider products={newArrivals.products.slice(0, 8)} title={secondCategory ? secondCategory.name : 'More Products'} />
          )}
        </>
      )}

      {/* CTA Section */}
      <section style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h2>Ready to transform your search experience?</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
          Browse categories, test search facets, and see vector search in action.
        </p>
        <Link to="/vector-search" className="btn btn-primary btn-lg">Try Vector Search</Link>
      </section>
    </div>
  );
}
