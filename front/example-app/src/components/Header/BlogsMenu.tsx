import { useState } from 'react'
import { Link } from 'react-router'
import { useLocale } from '../../hooks/useLocale'
import { getBlog } from '../../data/catalogService'

export function BlogsMenu() {
  const { language } = useLocale()
  const [open, setOpen] = useState(false)
  const sections = getBlog(language)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="px-3 py-2 text-sm font-medium text-paper-50 hover:text-accent-300"
      >
        Blogs
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 w-screen max-w-xl rounded-lg border border-line-200 bg-paper-50 p-6 shadow-xl">
          <div className="grid grid-cols-2 gap-6">
            {sections.map((section) => (
              <div key={section.slug}>
                <p className="mb-2 font-semibold text-ink-900">
                  {section.title}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {section.articles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        to={`/blogs/${article.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-sm text-ink-900/80 hover:text-brand-500"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
