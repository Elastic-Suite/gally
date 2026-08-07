'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../hooks/useSearch';
import { useCmsSearch } from '../hooks/useCms';
import { useTracking } from '../hooks/useTracking';
import Facets from '../components/Facets';
import ProductCard from '../components/ProductCard';
import BlogCard from '../components/BlogCard';

// A query hits two indices at once. `product` is the default tab; `blog` shows the
// cms_page documents the same query matched.
type ResultType = 'product' | 'blog';
const CMS_PAGE_SIZE = 10;

export default function SearchPage() {
  const { t, i18n } = useTranslation(['search', 'common', 'blog']);
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [page, setPage] = useState(1);
  const [cmsPage, setCmsPage] = useState(1);
  const [resultType, setResultType] = useState<ResultType>('product');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [facetsOpen, setFacetsOpen] = useState(false);

  // Filters can arrive pre-applied in the URL as repeatable `f_<field>=<value>`
  // params — that's how the autocomplete panel hands over an attribute option
  // (see SearchOverlay's attributeFilterUrl). Values are always arrays because
  // that's the shape the checkbox/swatch facets treat as "checked".
  const urlFilters = useMemo(() => {
    const out: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (!key.startsWith('f_')) return;
      const field = key.slice(2);
      out[field] = [...(out[field] ?? []), value];
    });
    return out;
  }, [searchParams]);

  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(urlFilters);

  // Re-seed on any URL change, not just `q`: arriving from the ACP with a filter
  // on the SAME query doesn't remount the page, so without this the incoming
  // filter would be dropped. Sidebar toggles don't touch the URL, so they don't
  // trigger this and aren't clobbered.
  const searchKey = searchParams.toString();
  const prevSearchRef = useRef(searchKey);
  useEffect(() => {
    if (prevSearchRef.current !== searchKey) {
      prevSearchRef.current = searchKey;
      setPage(1);
      setCmsPage(1);
      // A new query is a new pair of result sets — going back to the default segment
      // avoids landing on an empty Articles side for a query with no editorial match.
      setResultType('product');
      setActiveFilters(urlFilters);
    }
  }, [searchKey, urlFilters]);

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

  // Always fetched, whichever segment is active: the switch shows the count on both
  // sides, so it has to be known before that side is opened.
  const {
    pages: cmsPages, total: cmsTotal, pageCount: cmsPageCount, loading: cmsLoading,
  } = useCmsSearch({
    searchQuery: query,
    pageSize: CMS_PAGE_SIZE,
    currentPage: cmsPage,
    skip: !query,
  });

  const { trackSearch, trackDisplay, trackCmsDisplay } = useTracking();
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

  const trackedCmsDisplayRef = useRef('');

  useEffect(() => {
    if (resultType !== 'blog' || cmsLoading || cmsPages.length === 0) return;
    const key = cmsPages.map(p => p.id).join(',');
    if (trackedCmsDisplayRef.current === key) return;
    trackedCmsDisplayRef.current = key;
    trackCmsDisplay(cmsPages.map((p, i) => ({
      id: p.id, position: (cmsPage - 1) * CMS_PAGE_SIZE + i,
    })));
  }, [resultType, cmsPages, cmsLoading, cmsPage, trackCmsDisplay]);

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

      {/* One query, two indices. Both segments are always shown — a zero on the
          Articles side is information ("nothing written about this"), not a reason to
          hide it. Rendered as a centered segmented switch so the two indices read as
          one choice rather than as navigation; still a tablist for assistive tech. */}
      <div className="result-type-switch-row">
        {/* data-active drives the sliding thumb in CSS — see .result-type-tabs::before */}
        <div className="result-type-tabs" role="tablist" data-active={resultType}>
          <button
            type="button"
            role="tab"
            aria-selected={resultType === 'product'}
            className={`result-type-tab ${resultType === 'product' ? 'active' : ''}`}
            onClick={() => setResultType('product')}
          >
            <span className="result-type-icon" aria-hidden="true">🛍️</span>
            {t('page.typeProducts')}
            <span className="result-type-count">{loading ? '…' : total}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={resultType === 'blog'}
            className={`result-type-tab ${resultType === 'blog' ? 'active' : ''}`}
            onClick={() => setResultType('blog')}
          >
            <span className="result-type-icon" aria-hidden="true">📰</span>
            {t('page.typeBlog')}
            <span className="result-type-count">{cmsLoading ? '…' : cmsTotal}</span>
          </button>
        </div>
      </div>

      {resultType === 'blog' ? (
        <BlogResults
          pages={cmsPages}
          total={cmsTotal}
          loading={cmsLoading}
          page={cmsPage}
          pageCount={cmsPageCount}
          onPage={p => { setCmsPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          language={i18n.language}
        />
      ) : (
      <>
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
          resultCount={total}
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
      </>
      )}
    </div>
  );
}

// The Articles side: no facet sidebar (product facets don't apply to cms_page) and no sort
// control — editorial results are relevance-ranked, which is the only order that means
// anything for a query. Browsing by type/topic is what /blog is for.
function BlogResults({ pages, total, loading, page, pageCount, onPage, language }: {
  pages: any[]; total: number; loading: boolean; page: number; pageCount: number;
  onPage: (p: number) => void; language: string;
}) {
  const { t } = useTranslation(['search', 'blog']);

  return (
    <div className="search-blog-results">
      <div className="products-header">
        <div className="products-count">
          {loading ? t('search:page.searching') : t('blog:count', { count: total })}
        </div>
      </div>

      {loading ? (
        <div className="blog-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-card-image skeleton-shimmer" />
              <div className="skeleton-card-body">
                <div className="skeleton skeleton-text" style={{ width: '80%' }} />
                <div className="skeleton skeleton-text" style={{ width: '50%', marginTop: '0.5rem' }} />
              </div>
            </div>
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="empty-state">
          <h3>{t('search:page.noBlogTitle')}</h3>
          <p>{t('search:page.noBlogBody')}</p>
        </div>
      ) : (
        <div className="blog-grid">
          {pages.map(post => (
            <BlogCard key={post.id} post={post} language={language} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => onPage(page - 1)}>{t('search:page.prev')}</button>
          {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} className={p === page ? 'active' : ''} onClick={() => onPage(p)}>
              {p}
            </button>
          ))}
          <button disabled={page >= pageCount} onClick={() => onPage(page + 1)}>{t('search:page.next')}</button>
        </div>
      )}
    </div>
  );
}
