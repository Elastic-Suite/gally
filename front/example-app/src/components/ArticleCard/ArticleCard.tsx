import { Link } from 'react-router'
import type { BlogArticle } from '../../data/types'

export function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Link
      to={`/blogs/${article.slug}`}
      className="group overflow-hidden rounded-lg border border-line-200"
      data-testid="article-card"
    >
      <div className="aspect-[16/9] overflow-hidden bg-line-200">
        <img
          src={article.heroImage}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-500">
          {article.section}
        </p>
        <h3 className="mt-1 font-medium text-ink-900 group-hover:text-brand-500">
          {article.title}
        </h3>
        <p className="mt-1 text-sm text-ink-900/60">{article.excerpt}</p>
      </div>
    </Link>
  )
}
