import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { useTracking } from '../hooks/useTracking';
import { useCatalog } from '../contexts/CatalogContext';
import ProductCard from '../components/ProductCard';
import Facets from '../components/Facets';
import CategoryNav from '../components/CategoryNav';
import { ICategoryNode } from '../sdk/catalogs';

function findCategory(categories: ICategoryNode[], id: string): ICategoryNode | null {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.children) {
      const found = findCategory(cat.children, id);
      if (found) return found;
    }
  }
  return null;
}

export default function CategoryPage() {
  const { code } = useParams<{ code: string }>();
  const { categories } = useCatalog();
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { trackCategoryView, trackDisplay } = useTracking();

  const category = code ? findCategory(categories, code) : null;
  const categoryName = category?.name || code || 'Category';

  // Reset page when category changes
  useEffect(() => { setPage(1); setFilters({}); }, [code]);

  // Build filter array from state
  const filterArray = useMemo(() => Object.entries(filters)
    .filter(([, v]) => v !== undefined)
    .map(([field, value]) => {
      if (Array.isArray(value)) return { [field]: { in: value } };
      if (typeof value === 'object' && value.gte !== undefined) return { [field]: value };
      if (typeof value === 'boolean') return { [field]: { eq: value } };
      return { [field]: { eq: value } };
    }), [filters]);

  const { products, total, pageCount, aggregations, loading, viewMoreOptions } = useSearch({
    categoryCode: code,
    currentPage: page,
    sortField: sortField || undefined,
    sortDirection,
    filters: filterArray.length ? filterArray : undefined,
    pageSize: 20,
  });

  const trackedCatRef = useRef('');
  const trackedDisplayRef = useRef('');

  useEffect(() => {
    const key = `${code}|${page}|${total}`;
    if (code && total > 0 && trackedCatRef.current !== key) {
      trackedCatRef.current = key;
      trackCategoryView(code, total, page, pageCount);
    }
  }, [code, total, page, pageCount, trackCategoryView]);

  useEffect(() => {
    if (products.length > 0 && !loading) {
      const key = products.map((p: any) => p.sku).join(',');
      if (trackedDisplayRef.current !== key) {
        trackedDisplayRef.current = key;
        trackDisplay(products.map((p: any, i: number) => ({ sku: p.sku, position: i })));
      }
    }
  }, [products, loading, trackDisplay]);

  const handleFilterChange = useCallback((field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, dir] = e.target.value.split(':');
    setSortField(field);
    setSortDirection(dir as 'asc' | 'desc');
    setPage(1);
  };

  return (
    <div>
      <CategoryNav activeCode={code} />

      <div className="page-title">
        <div className="breadcrumb">Home / Categories / {categoryName}</div>
        <h1>{categoryName}</h1>
        {category && <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{category.count} products in this category</span>}
      </div>

      <button className="btn btn-outline btn-sm mobile-filter-toggle">
        ☰ Filters
      </button>

      <div className="catalog-page">
        <Facets
          aggregations={aggregations}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
          onLoadMore={viewMoreOptions}
        />

        <div>
          <div className="products-header">
            <span className="products-count">{total} products</span>
            <div className="products-sort">
              <select onChange={handleSort} value={`${sortField}:${sortDirection}`}>
                <option value=":asc">Sort by</option>
                <option value="_score:desc">Relevance</option>
                <option value="name:asc">Name A-Z</option>
                <option value="name:desc">Name Z-A</option>
                <option value="price__price:asc">Price ↑</option>
                <option value="price__price:desc">Price ↓</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p: any, i: number) => (
                <ProductCard key={p.sku || i} product={p} />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>←</button>
              {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} className={p === page ? 'active' : ''} onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  {p}
                </button>
              ))}
              {pageCount > 5 && <span>…</span>}
              <button disabled={page >= pageCount} onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>→</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
