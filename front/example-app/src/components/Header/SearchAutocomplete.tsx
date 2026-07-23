import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useLocale } from '../../hooks/useLocale'
import { suggest, type SearchSuggestions } from '../../data/catalogService'
import { formatPrice } from '../../lib/format'

const EMPTY: SearchSuggestions = {
  terms: [],
  products: [],
  categories: [],
  attributes: [],
}

export function SearchAutocomplete() {
  const { country, language } = useLocale()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<SearchSuggestions>(EMPTY)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setResults(query.trim().length >= 2 ? suggest(language, query) : EMPTY)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, language])

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      )
        setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const goToSearch = (q: string) => {
    if (!q.trim()) return
    setOpen(false)
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const hasResults =
    results.terms.length +
      results.products.length +
      results.categories.length +
      results.attributes.length >
    0

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          goToSearch(query)
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products, categories, colors..."
          aria-label="Search"
          className="w-full rounded-full border border-white/10 bg-paper-50 px-4 py-2 text-sm text-ink-900 focus:border-brand-400 focus:outline-none"
        />
      </form>
      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 top-full z-30 mt-2 w-full rounded-lg border border-line-200 bg-paper-50 p-4 shadow-xl">
          {!hasResults && (
            <p className="text-sm text-ink-900/60">
              No suggestions for &ldquo;{query}&rdquo;.
            </p>
          )}

          {results.terms.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-900/50">
                Suggested searches
              </p>
              <ul className="flex flex-col gap-2">
                {results.terms.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => goToSearch(term)}
                      className="flex w-full items-center gap-2 text-left text-sm hover:text-brand-500"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="shrink-0 text-ink-900/40"
                        aria-hidden="true"
                      >
                        <circle cx="9" cy="9" r="6" />
                        <path strokeLinecap="round" d="M17 17l-3.5-3.5" />
                      </svg>
                      <span className="flex-1">{term}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.products.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-900/50">
                Products
              </p>
              <ul className="flex flex-col gap-2">
                {results.products.map((product) => (
                  <li key={product.sku}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        navigate(`/product/${product.urlKey}`)
                      }}
                      className="flex w-full items-center gap-2 text-left text-sm hover:text-brand-500"
                    >
                      <img
                        src={product.image}
                        alt=""
                        className="h-8 w-8 rounded object-cover"
                      />
                      <span className="flex-1">{product.name}</span>
                      <span className="text-ink-900/60">
                        {formatPrice(product.price, country, language)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.categories.length > 0 && (
            <div className="mb-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-900/50">
                Categories
              </p>
              <ul className="flex flex-col gap-1">
                {results.categories.map((category) => (
                  <li key={category.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        navigate(`/category/${category.slug}`)
                      }}
                      className="text-sm hover:text-brand-500"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.attributes.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-900/50">
                Attributes
              </p>
              <ul className="flex flex-wrap gap-2">
                {results.attributes.map((attr) => (
                  <li key={`${attr.kind}-${attr.value}`}>
                    <button
                      type="button"
                      onClick={() => goToSearch(attr.label)}
                      className="rounded-full border border-line-200 px-3 py-1 text-xs hover:border-brand-400 hover:text-brand-500"
                    >
                      {attr.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
