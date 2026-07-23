import { useLocale } from '../hooks/useLocale'
import { getBlog } from '../data/catalogService'
import { ArticleCard } from '../components/ArticleCard/ArticleCard'

export function BlogIndexPage() {
  const { language } = useLocale()
  const sections = getBlog(language)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink-900">Blogs</h1>

      {sections.map((section) => (
        <section key={section.slug} className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-ink-900">
            {section.title}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {section.articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
