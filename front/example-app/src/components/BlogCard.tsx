import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CmsPage, cmsPageUrl, formatCmsDate } from '../hooks/useCms';

// The blog counterpart of ProductCard, shared by the blog index and the blog tab of
// the search results page. Same card idiom as ProductCard (see styles.css) — this is
// not a second card primitive, only different content in the same envelope.
export default function BlogCard({ post, language }: { post: CmsPage; language: string }) {
  const { t } = useTranslation('blog');
  return (
    <Link to={cmsPageUrl(post.id)} className="blog-card">
      <div className="blog-card-image">
        {post.image
          ? <img src={post.image} alt={post.title} loading="lazy" />
          : <span className="blog-card-image-fallback">✎</span>}
        {post.topic && <span className="blog-card-topic">{post.topic.label}</span>}
      </div>
      <div className="blog-card-body">
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-summary">{post.summary}</p>
        <div className="blog-card-meta">
          {post.author?.label}
          {post.publishedAt && ` · ${formatCmsDate(post.publishedAt, language)}`}
          {post.readingTime ? ` · ${t('readingTime', { count: post.readingTime })}` : ''}
        </div>
      </div>
    </Link>
  );
}
