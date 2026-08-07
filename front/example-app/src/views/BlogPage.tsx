'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCmsSearch } from '../hooks/useCms';
import { useTracking } from '../hooks/useTracking';
import BlogCard from '../components/BlogCard';

const PAGE_SIZE = 10;

// The two browse axes, both fed by the API's own aggregations. `content_type` is the
// coarse one (editorial posts vs. the legacy buying guides) so it reads as a toggle;
// `topic` has ten values so it reads as a row of chips.
const TYPE_FIELD = 'content_type__value';
const TOPIC_FIELD = 'topic__value';

function findAggregation(aggregations: any[], field: string) {
  return aggregations.find(a => a.field === field);
}

export default function BlogPage() {
  const { t, i18n } = useTranslation(['blog', 'common']);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackCmsDisplay } = useTracking();

  const type = searchParams.get('type') || '';
  const topic = searchParams.get('topic') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  // Generic entities filter through `FieldFilterInput`, which names the field inside
  // the filter — NOT the product shape `{ field: { eq } }`. See docs/sdk-reference.md.
  const filters = useMemo(() => {
    const list: any[] = [];
    if (type) list.push({ equalFilter: { field: TYPE_FIELD, eq: type } });
    if (topic) list.push({ equalFilter: { field: TOPIC_FIELD, eq: topic } });
    return list;
  }, [type, topic]);

  const { pages, total, pageCount, aggregations, loading, error } = useCmsSearch({
    filters,
    // "The 10 latest posts" — newest first is the section's default order, not a
    // user-chosen sort, so there's no sort dropdown here.
    sortField: 'published_at',
    sortDirection: 'desc',
    pageSize: PAGE_SIZE,
    currentPage: page,
  });

  // Changing a filter always returns to page 1 — page 4 of "all posts" is rarely
  // page 4 of the topic you just picked.
  const setParams = (next: { type?: string; topic?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams);
    (['type', 'topic'] as const).forEach(key => {
      if (next[key] === undefined) return;
      if (next[key]) params.set(key, next[key] as string);
      else params.delete(key);
    });
    // No page in the call means a filter changed, so the page resets — same delete
    // as landing back on page 1 explicitly.
    if (next.page && next.page > 1) params.set('page', String(next.page));
    else params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Impressions carry the real position in the whole result set, not the index
  // within the page — same convention as SearchPage's product display event.
  const trackedRef = useRef('');
  useEffect(() => {
    if (loading || pages.length === 0) return;
    const key = pages.map(p => p.id).join(',');
    if (trackedRef.current === key) return;
    trackedRef.current = key;
    trackCmsDisplay(pages.map((p, i) => ({ id: p.id, position: (page - 1) * PAGE_SIZE + i })));
  }, [loading, pages, page, trackCmsDisplay]);

  const typeAgg = findAggregation(aggregations, TYPE_FIELD);
  const topicAgg = findAggregation(aggregations, TOPIC_FIELD);

  return (
    <div className="blog-page">
      <div className="page-title">
        <div className="breadcrumb">{t('blog:breadcrumb')}</div>
        <h1>{t('blog:title')}</h1>
        <p className="blog-intro">{t('blog:intro')}</p>
      </div>

      <div className="blog-browse">
        <div className="blog-browse-row">
          <span className="blog-browse-label">{t('blog:browse.type')}</span>
          <div className="blog-chips">
            <button
              type="button"
              className={`filter-chip ${!type ? 'filter-chip-selected' : ''}`}
              onClick={() => setParams({ type: '' })}
            >
              {t('blog:browse.all')}
            </button>
            {(typeAgg?.options ?? []).map((opt: any) => (
              <button
                key={opt.value}
                type="button"
                className={`filter-chip ${type === opt.value ? 'filter-chip-selected' : ''}`}
                onClick={() => setParams({ type: type === opt.value ? '' : opt.value })}
              >
                {opt.label} <span className="filter-chip-count">{opt.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="blog-browse-row">
          <span className="blog-browse-label">{t('blog:browse.topic')}</span>
          <div className="blog-chips">
            <button
              type="button"
              className={`filter-chip ${!topic ? 'filter-chip-selected' : ''}`}
              onClick={() => setParams({ topic: '' })}
            >
              {t('blog:browse.all')}
            </button>
            {(topicAgg?.options ?? []).map((opt: any) => (
              <button
                key={opt.value}
                type="button"
                className={`filter-chip ${topic === opt.value ? 'filter-chip-selected' : ''}`}
                onClick={() => setParams({ topic: topic === opt.value ? '' : opt.value })}
              >
                {opt.label} <span className="filter-chip-count">{opt.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="products-header">
        <span className="products-count">{t('blog:count', { count: total })}</span>
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
      ) : error || pages.length === 0 ? (
        <div className="empty-state">
          <h3>{t('blog:emptyTitle')}</h3>
          <p>{t('blog:emptyBody')}</p>
        </div>
      ) : (
        <div className="blog-grid">
          {pages.map(post => (
            <BlogCard key={post.id} post={post} language={i18n.language} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setParams({ page: page - 1 })}>←</button>
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1).map(p => (
            <button key={p} className={p === page ? 'active' : ''} onClick={() => setParams({ page: p })}>
              {p}
            </button>
          ))}
          {pageCount > 5 && <span>…</span>}
          <button disabled={page >= pageCount} onClick={() => setParams({ page: page + 1 })}>→</button>
        </div>
      )}
    </div>
  );
}
