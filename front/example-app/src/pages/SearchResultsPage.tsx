import { useMemo } from 'react'
import { useLocale } from '../hooks/useLocale'
import { useProductFilters } from '../hooks/useProductFilters'
import { useArticleFilters } from '../hooks/useArticleFilters'
import { FacetSidebar } from '../components/FacetSidebar/FacetSidebar'
import { ProductGrid } from '../components/ProductGrid/ProductGrid'
import { Pagination } from '../components/Pagination/Pagination'
import { Tabs } from '../components/Tabs/Tabs'
import { ArticleCard } from '../components/ArticleCard/ArticleCard'
import {
  applyArticleFilters,
  applyFilters,
  computeArticleFacets,
  computeFacets,
  findCategoryById,
  hasActiveFilters,
  hasActiveArticleFilters,
  searchArticles,
  searchProducts,
  sortProducts,
  TOP_LEVEL_CATEGORY_IDS,
} from '../data/catalogService'
import type { SortKey } from '../data/types'

export function SearchResultsPage() {
  const { language } = useLocale()
  const {
    filters,
    sort,
    query,
    page,
    pageSize,
    toggleValue,
    setPriceRange,
    setSort,
    setPage,
    setPageSize,
    clearAll,
  } = useProductFilters()
  const {
    filters: articleFilters,
    toggleValue: toggleArticleValue,
    clearAll: clearArticleFilters,
  } = useArticleFilters()

  const scopeProducts = useMemo(
    () => searchProducts(language, query),
    [language, query],
  )
  const scopeArticles = useMemo(
    () => searchArticles(language, query),
    [language, query],
  )

  const topLevelOptions = useMemo(
    () =>
      TOP_LEVEL_CATEGORY_IDS.map((id) => findCategoryById(language, id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .map((c) => ({ id: c.id, name: c.name })),
    [language],
  )

  const articleCategoryOptions = useMemo(() => {
    const ids = new Set(scopeArticles.flatMap((a) => a.relatedCategoryIds))
    return [...ids]
      .map((id) => findCategoryById(language, id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => ({ id: c.id, name: c.name }))
  }, [scopeArticles, language])

  const facets = useMemo(
    () => computeFacets(scopeProducts, filters, topLevelOptions),
    [scopeProducts, filters, topLevelOptions],
  )

  const articleFacets = useMemo(
    () =>
      computeArticleFacets(
        scopeArticles,
        articleFilters,
        articleCategoryOptions,
      ),
    [scopeArticles, articleFilters, articleCategoryOptions],
  )

  const products = useMemo(
    () => sortProducts(applyFilters(scopeProducts, filters), sort),
    [scopeProducts, filters, sort],
  )

  const articles = useMemo(
    () => applyArticleFilters(scopeArticles, articleFilters),
    [scopeArticles, articleFilters],
  )

  const pageProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    return products.slice(start, start + pageSize)
  }, [products, page, pageSize])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink-900">
        {query ? <>Search results for &ldquo;{query}&rdquo;</> : 'Search'}
      </h1>

      <Tabs
        items={[
          {
            label: `Products (${products.length})`,
            content: (
              <div className="flex flex-col gap-8 lg:flex-row">
                <FacetSidebar
                  facets={facets}
                  selectedValues={{
                    categoryIds: filters.categoryIds,
                    colors: filters.colors,
                    sizes: filters.sizes,
                    materials: filters.materials,
                    styles: filters.styles,
                  }}
                  onToggle={
                    toggleValue as (field: string, value: string) => void
                  }
                  onPriceRangeChange={setPriceRange}
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  hasActiveFilters={hasActiveFilters(filters)}
                  onClearAll={clearAll}
                />
                <div className="dotted-bg flex-1 rounded-xl p-4">
                  <div className="mb-4 flex justify-end">
                    <label className="flex items-center gap-2 text-sm text-ink-900/70">
                      Sort by
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="rounded border border-line-200 bg-paper-50 px-2 py-1"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="price-asc">Price: low to high</option>
                        <option value="price-desc">Price: high to low</option>
                        <option value="name-asc">Name: A-Z</option>
                      </select>
                    </label>
                  </div>
                  <ProductGrid
                    products={pageProducts}
                    columnsClassName="grid-cols-3"
                    cardVariant="stat"
                  />
                  <Pagination
                    page={page}
                    pageSize={pageSize}
                    totalItems={products.length}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                  />
                </div>
              </div>
            ),
          },
          {
            label: `CMS pages (${articles.length})`,
            content: (
              <div className="flex flex-col gap-8 lg:flex-row">
                <FacetSidebar
                  facets={articleFacets}
                  selectedValues={{
                    sections: articleFilters.sections,
                    categoryIds: articleFilters.categoryIds,
                  }}
                  onToggle={
                    toggleArticleValue as (field: string, value: string) => void
                  }
                  hasActiveFilters={hasActiveArticleFilters(articleFilters)}
                  onClearAll={clearArticleFilters}
                />
                <div className="dotted-bg flex-1 rounded-xl p-4">
                  {articles.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {articles.map((article) => (
                        <ArticleCard key={article.slug} article={article} />
                      ))}
                    </div>
                  ) : (
                    <p className="py-16 text-center text-ink-900/60">
                      No CMS pages match this search.
                    </p>
                  )}
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
