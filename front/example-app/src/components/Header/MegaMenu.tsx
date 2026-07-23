import { useState } from 'react'
import { Link } from 'react-router'
import { useLocale } from '../../hooks/useLocale'
import { getCategoryTree } from '../../data/catalogService'
import type { CategoryNode } from '../../data/types'

function CategoryThumb({
  category,
  showImage = true,
}: {
  category: CategoryNode
  showImage?: boolean
}) {
  return (
    <span className="flex items-center gap-2">
      {showImage &&
        (category.image ? (
          <img
            src={category.image}
            alt=""
            className="h-8 w-8 shrink-0 rounded object-cover"
          />
        ) : (
          <span className="h-8 w-8 shrink-0 rounded bg-line-200" />
        ))}
      <span>{category.name}</span>
    </span>
  )
}

export function MegaMenu() {
  const { language } = useLocale()
  const [open, setOpen] = useState(false)
  const categories = getCategoryTree(language)
  const topLevel = categories[0]?.children ?? []

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
        Categories
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 w-screen max-w-4xl rounded-lg border border-line-200 bg-paper-50 p-6 text-ink-900 shadow-xl">
          <div className="columns-3 gap-6">
            {topLevel.map((level1) => (
              <div key={level1.id} className="mb-6 break-inside-avoid">
                <Link
                  to={`/category/${level1.slug}`}
                  onClick={() => setOpen(false)}
                  className="mb-2 block font-semibold text-ink-900 hover:text-brand-500"
                >
                  <CategoryThumb category={level1} showImage={false} />
                </Link>
                <ul className="flex flex-col gap-1.5 pl-3">
                  {level1.children.map((level2) => (
                    <li key={level2.id}>
                      <Link
                        to={`/category/${level2.slug}`}
                        onClick={() => setOpen(false)}
                        className="block text-sm text-ink-900/80 hover:text-brand-500"
                      >
                        <CategoryThumb category={level2} />
                      </Link>
                      {level2.children.length > 0 && (
                        <ul className="mt-1 flex flex-col gap-1 pl-6">
                          {level2.children.map((level3) => (
                            <li key={level3.id}>
                              <Link
                                to={`/category/${level3.slug}`}
                                onClick={() => setOpen(false)}
                                className="block text-xs text-ink-900/60 hover:text-brand-500"
                              >
                                <CategoryThumb category={level3} />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
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
