import { Link, useParams } from 'react-router'
import { useLocale } from '../hooks/useLocale'
import {
  getBlog,
  getAllProducts,
  findCategoryById,
} from '../data/catalogService'
import { ProductGrid } from '../components/ProductGrid/ProductGrid'

export function BlogArticlePage() {
  const { slug = '' } = useParams()
  const { language } = useLocale()

  const article = getBlog(language)
    .flatMap((section) => section.articles)
    .find((a) => a.slug === slug)

  if (!article) {
    return (
      <p className="mx-auto max-w-7xl px-4 py-16 text-center text-ink-900/60 sm:px-6 lg:px-8">
        Article not found.
      </p>
    )
  }

  const relatedProducts = getAllProducts(language).filter((p) =>
    article.relatedSkus.includes(p.sku),
  )
  const relatedCategories = article.relatedCategoryIds
    .map((id) => findCategoryById(language, id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-wide text-brand-500">
        {article.section}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-ink-900">{article.title}</h1>

      <div className="mt-6 aspect-[16/9] overflow-hidden rounded-lg bg-line-200">
        <img
          src={article.heroImage}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="prose prose-sm mt-6 max-w-none text-ink-900/80">
        {article.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {relatedCategories.length > 0 && (
        <p className="mt-6 text-sm text-ink-900/60">
          Explore:{' '}
          {relatedCategories.map((c, i) => (
            <span key={c.id}>
              {i > 0 && ', '}
              <Link
                to={`/category/${c.slug}`}
                className="text-brand-500 hover:underline"
              >
                {c.name}
              </Link>
            </span>
          ))}
        </p>
      )}

      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">
            Featured in this article
          </h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </article>
  )
}
