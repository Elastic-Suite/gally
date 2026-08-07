'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../hooks/useSearch';
import { useTracking } from '../hooks/useTracking';
import { useCatalog } from '../contexts/CatalogContext';
import ProductCard from '../components/ProductCard';
import Facets from '../components/Facets';
import { ProductGridSkeleton } from '../components/skeletons';
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

// `initialData` is the first page of this category, fetched by the Server Component.
export default function CategoryPage({
  initialData,
}: {
  initialData?: { products: any[]; total: number; pageCount: number; aggregations: any[] };
} = {}) {
  const { t } = useTranslation(['category', 'common']);
  const params = useParams();
  const code = Array.isArray(params.code) ? params.code[0] : params.code;
  const { categories } = useCatalog();
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const { trackCategoryView, trackDisplay } = useTracking();

  const category = code ? findCategory(categories, code) : null;
  const categoryName = category?.name || code || t('category.fallbackName');

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

  // The server pre-fetched only the FIRST page, unsorted and unfiltered. Handing it to
  // the hook for any other state would render stale results, so it is passed through
  // only when the current view matches what the server actually fetched.
  const isServerFetchedView =
    page === 1 && !sortField && filterArray.length === 0;

  const { products, total, pageCount, aggregations, loading, viewMoreOptions } = useSearch({
    categoryCode: code,
    currentPage: page,
    sortField: sortField || undefined,
    sortDirection,
    filters: filterArray.length ? filterArray : undefined,
    pageSize: 20,
    initialData: initialData && isServerFetchedView ? initialData : undefined,
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
      <div className="page-title">
        <div className="breadcrumb">{t('category.breadcrumb', { name: categoryName })}</div>
        <h1>{categoryName}</h1>
        {category && <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{t('category.countInCategory', { count: category.count })}</span>}
      </div>

      <button className="btn btn-outline btn-sm mobile-filter-toggle">
        ☰ {t('common:actions.filters')}
      </button>

      <div className="catalog-page">
        <Facets
          aggregations={aggregations}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
          onLoadMore={viewMoreOptions}
          resultCount={total}
        />

        <div>
          <div className="products-header">
            <span className="products-count">{t('category.count', { count: total })}</span>
            <div className="products-sort">
              <select onChange={handleSort} value={`${sortField}:${sortDirection}`}>
                <option value=":asc">{t('category.sort.placeholder')}</option>
                <option value="_score:desc">{t('category.sort.relevance')}</option>
                <option value="name:asc">{t('category.sort.nameAsc')}</option>
                <option value="name:desc">{t('category.sort.nameDesc')}</option>
                <option value="price__price:asc">{t('category.sort.priceAsc')}</option>
                <option value="price__price:desc">{t('category.sort.priceDesc')}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>{t('category.emptyTitle')}</h3>
              <p>{t('category.emptyBody')}</p>
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
