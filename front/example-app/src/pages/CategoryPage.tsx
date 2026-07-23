import { useMemo } from 'react'
import { useParams } from 'react-router'
import { useLocale } from '../hooks/useLocale'
import { useProductFilters } from '../hooks/useProductFilters'
import { FacetSidebar } from '../components/FacetSidebar/FacetSidebar'
import { ProductGrid } from '../components/ProductGrid/ProductGrid'
import { Pagination } from '../components/Pagination/Pagination'
import {
  applyFilters,
  computeFacets,
  findCategoryBySlug,
  getProductsForCategory,
  sortProducts,
} from '../data/catalogService'
import type { SortKey } from '../data/types'

export function CategoryPage() {
  const { slug = '' } = useParams()
  const { language } = useLocale()
  const {
    filters,
    sort,
    page,
    pageSize,
    toggleValue,
    setPriceRange,
    setSort,
    setPage,
    setPageSize,
    clearAll,
  } = useProductFilters()

  const category = findCategoryBySlug(language, slug)
  const scopeProducts = useMemo(
    () => (category ? getProductsForCategory(language, category.id) : []),
    [category, language],
  )

  const facets = useMemo(
    () =>
      computeFacets(
        scopeProducts,
        filters,
        category?.children.map((c) => ({ id: c.id, name: c.name })) ?? [],
      ),
    [scopeProducts, filters, category],
  )

  const products = useMemo(
    () => sortProducts(applyFilters(scopeProducts, filters), sort),
    [scopeProducts, filters, sort],
  )

  const pageProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    return products.slice(start, start + pageSize)
  }, [products, page, pageSize])

  if (!category) {
    return (
      <p className="mx-auto max-w-7xl px-4 py-16 text-center text-ink-900/60 sm:px-6 lg:px-8">
        Category not found.
      </p>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink-900">{category.name}</h1>
      <p className="mt-1 text-sm text-ink-900/60">{products.length} products</p>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <FacetSidebar
          facets={facets}
          filters={filters}
          onToggle={toggleValue}
          onPriceRangeChange={setPriceRange}
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
                <option value="relevance">Featured</option>
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
    </div>
  )
}
