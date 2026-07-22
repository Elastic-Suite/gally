import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { useTracking } from '../hooks/useTracking';
import Facets from '../components/Facets';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [facetsOpen, setFacetsOpen] = useState(false);

  // Reset page when query changes
  useEffect(() => { setPage(1); }, [query]);

  const filters = Object.entries(activeFilters)
    .filter(([, val]) => val !== undefined)
    .map(([field, val]) => {
      if (typeof val === 'object' && val.gte !== undefined) {
        return { [field]: { gte: val.gte, lte: val.lte } };
      }
      if (typeof val === 'boolean') {
        return { [field]: { eq: val } };
      }
      if (Array.isArray(val)) {
        return { [field]: { in: val } };
      }
      return { [field]: { eq: val } };
    });

  const { products, total, pageCount, aggregations, loading } = useSearch({
    searchQuery: query,
    currentPage: page,
    pageSize: 20,
    sortField: sortField || '_score',
    sortDirection,
    filters: filters.length > 0 ? filters : undefined,
  });

  const { trackSearch, trackDisplay } = useTracking();

  useEffect(() => {
    if (query && total > 0) {
      trackSearch(query, total, page, pageCount);
    }
  }, [query, total, page, pageCount, trackSearch]);

  useEffect(() => {
    if (products.length > 0) {
      trackDisplay(products.map((p: any, i: number) => ({ sku: p.sku, position: (page - 1) * 20 + i })));
    }
  }, [products, page, trackDisplay]);

  const handleFilterChange = useCallback((field: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  }, []);

  return (
    <div>
      <div className="page-title">
        <div className="breadcrumb">Home / Search</div>
        <h1>{query ? `Results for "${query}"` : 'All Products'}</h1>
      </div>

      <button className="btn btn-outline mobile-filter-toggle" onClick={() => setFacetsOpen(!facetsOpen)}>
        ☰ Filters
      </button>

      <div className="catalog-page">
        <div className={`facets-sidebar ${facetsOpen ? 'open' : ''}`}>
          <Facets
            aggregations={aggregations}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div>
          <div className="products-header">
            <div className="products-count">
              {loading ? 'Searching…' : `${total} results`}
            </div>
            <div className="products-sort">
              <select
                value={`${sortField}:${sortDirection}`}
                onChange={e => {
                  const [f, d] = e.target.value.split(':');
                  setSortField(f);
                  setSortDirection(d as 'asc' | 'desc');
                }}
              >
                <option value="_score:desc">Relevance</option>
                <option value="name:asc">Name A→Z</option>
                <option value="price__price:asc">Price: Low to High</option>
                <option value="price__price:desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="loading">
              <div className="loading-spinner" />
              Searching…
            </div>
          )}

          <div className="products-grid">
            {products.map((p: any, i: number) => (
              <ProductCard key={p.sku || i} product={p} />
            ))}
          </div>

          {!loading && products.length === 0 && (
            <div className="empty-state">
              <h3>No results found</h3>
              <p>Try a different search term or adjust your filters.</p>
            </div>
          )}

          {pageCount > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
              {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              <button disabled={page >= pageCount} onClick={() => setPage(p => p + 1)}>Next ›</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
