import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../hooks/useSearch';
import { useTracking } from '../hooks/useTracking';
import Facets from '../components/Facets';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const { t } = useTranslation(['search', 'common']);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [facetsOpen, setFacetsOpen] = useState(false);

  // Reset page and filters when query changes
  const prevQueryRef = useRef(query);
  useEffect(() => {
    if (prevQueryRef.current !== query) {
      setPage(1);
      setActiveFilters({});
      prevQueryRef.current = query;
    }
  }, [query]);

  const filters = useMemo(() => Object.entries(activeFilters)
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
    }), [activeFilters]);

  const { products, total, pageCount, aggregations, loading, viewMoreOptions } = useSearch({
    searchQuery: query,
    currentPage: page,
    pageSize: 20,
    sortField: sortField || '_score',
    sortDirection,
    filters: filters.length > 0 ? filters : undefined,
  });

  const { trackSearch, trackDisplay } = useTracking();
  const trackedRef = useRef('');

  useEffect(() => {
    const key = `${query}|${page}|${total}`;
    if (query && total > 0 && trackedRef.current !== key) {
      trackedRef.current = key;
      trackSearch(query, total, page, pageCount);
    }
  }, [query, total, page, pageCount, trackSearch]);

  const trackedDisplayRef = useRef('');

  useEffect(() => {
    if (products.length > 0 && !loading) {
      const key = products.map((p: any) => p.sku).join(',');
      if (trackedDisplayRef.current !== key) {
        trackedDisplayRef.current = key;
        trackDisplay(products.map((p: any, i: number) => ({ sku: p.sku, position: (page - 1) * 20 + i })));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, loading]);

  const handleFilterChange = useCallback((field: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div>
      <div className="page-title">
        <div className="breadcrumb">{t('page.breadcrumb')}</div>
        <h1>{query ? t('page.resultsFor', { query }) : t('page.allProducts')}</h1>
      </div>

      <button className="btn btn-outline mobile-filter-toggle" onClick={() => setFacetsOpen(!facetsOpen)}>
        ☰ {t('common:actions.filters')}
      </button>

      <div className="catalog-page">
        <Facets
          aggregations={aggregations}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          loading={loading}
          onLoadMore={viewMoreOptions}
          open={facetsOpen}
        />

        <div>
          <div className="products-header">
            <div className="products-count">
              {loading ? t('page.searching') : t('page.resultCount', { count: total })}
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
                <option value="_score:desc">{t('page.sort.relevance')}</option>
                <option value="name:asc">{t('page.sort.nameAsc')}</option>
                <option value="price__price:asc">{t('page.sort.priceAsc')}</option>
                <option value="price__price:desc">{t('page.sort.priceDesc')}</option>
              </select>
            </div>
          </div>

          {loading && (
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
          )}

          <div className="products-grid">
            {products.map((p: any, i: number) => (
              <ProductCard key={p.sku || i} product={p} />
            ))}
          </div>

          {!loading && products.length === 0 && (
            <div className="empty-state">
              <h3>{t('page.emptyTitle')}</h3>
              <p>{t('page.emptyBody')}</p>
            </div>
          )}

          {pageCount > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{t('page.prev')}</button>
              {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} className={p === page ? 'active' : ''} onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  {p}
                </button>
              ))}
              <button disabled={page >= pageCount} onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{t('page.next')}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
