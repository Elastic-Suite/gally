'use client';

import { useEffect, useMemo, useRef } from 'react';
import Link from '../components/LocaleLink';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCmsSearch, formatCmsDate } from '../hooks/useCms';
import { BlogPostSkeleton } from '../components/skeletons';
import { useTracking } from '../hooks/useTracking';

// `initialPost` is the CmsPage the Server Component already fetched for this id.
export default function BlogPostPage({ initialPost }: { initialPost?: any } = {}) {
  const { t, i18n } = useTranslation(['blog', 'common']);
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { trackCmsPageView } = useTracking();

  // Fetched by `id`, not by slug: url_key is keyword-analyzed text with no `untouched`
  // sub-field, so the API can't filter on it (it 500s with "Unable to identify the
  // field property to use for filtering"). See docs/sdk-reference.md.
  const filters = useMemo(
    () => (id ? [{ equalFilter: { field: 'id', eq: id } }] : []),
    [id]
  );
  const { pages, loading, error } = useCmsSearch({
    filters,
    pageSize: 1,
    currentPage: 1,
    skip: !id,
    initialPages: initialPost ? [initialPost] : undefined,
  });

  const post = pages[0];

  const trackedRef = useRef('');
  useEffect(() => {
    if (post && trackedRef.current !== post.id) {
      trackedRef.current = post.id;
      trackCmsPageView(post.id, post.title);
    }
  }, [post, trackCmsPageView]);

  if (loading) {
    return <BlogPostSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="blog-post">
        <div className="empty-state">
          <h3>{t('blog:notFoundTitle')}</h3>
          <p>{t('blog:notFoundBody')}</p>
          <Link href="/blog" className="btn btn-outline btn-sm">{t('blog:backToList')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post">
      <div className="page-title">
        <div className="breadcrumb">
          <Link href="/blog">{t('blog:title')}</Link>
          {post.topic && ` / ${post.topic.label}`}
        </div>
      </div>

      {post.image && (
        <div className="blog-post-hero">
          <img src={post.image} alt={post.title} />
        </div>
      )}

      <h1 className="blog-post-title">{post.title}</h1>

      <div className="blog-post-meta">
        {post.contentType && <span className="blog-post-badge">{post.contentType.label}</span>}
        {post.author?.label}
        {post.publishedAt && ` · ${formatCmsDate(post.publishedAt, i18n.language)}`}
        {post.readingTime ? ` · ${t('blog:readingTime', { count: post.readingTime })}` : ''}
      </div>

      {post.summary && <p className="blog-post-summary">{post.summary}</p>}

      {/* The document's `content` is editorial HTML straight from the index — the same
          blob the search engine analyses. It's fixture-authored content from our own
          catalog, not user input. */}
      <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      {post.tags.length > 0 && (
        <div className="blog-post-tags">
          {post.tags.map(tag => (
            <span key={tag.value} className="filter-chip">{tag.label}</span>
          ))}
        </div>
      )}

      <Link href="/blog" className="btn btn-outline btn-sm blog-post-back">{t('blog:backToList')}</Link>
    </div>
  );
}
