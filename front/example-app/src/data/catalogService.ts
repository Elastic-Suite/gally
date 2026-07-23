import {
  getAllProducts,
  getCategoryTree as getRawCategoryTree,
} from './catalog'

export { getAllProducts }
import categoryIndexFr from './raw/categoryProductIndex.fr.json'
import categoryIndexEn from './raw/categoryProductIndex.en.json'
import {
  applyArticleFilters,
  computeArticleFacets,
  emptyArticleFilters,
  getBlog,
  hasActiveArticleFilters,
  searchArticles,
} from './blog'
import type {
  ActiveFilters,
  CategoryNode,
  Facet,
  FacetOption,
  Locale,
  Product,
  SortKey,
} from './types'

const CATEGORY_INDEX: Record<Locale, Record<string, string[]>> = {
  fr: categoryIndexFr,
  en: categoryIndexEn,
}

/** Top-level (level 2) category ids — stable across locales. */
export const TOP_LEVEL_CATEGORY_IDS = [
  'cat_8',
  'cat_11',
  'cat_14',
  'cat_3',
  'cat_15',
  'cat_7',
]

/** Complementary top-level category, used to recommend "goes well with" products. */
const COMPLEMENTARY_CATEGORY: Record<string, string> = {
  cat_8: 'cat_11',
  cat_11: 'cat_8',
  cat_14: 'cat_3',
  cat_3: 'cat_14',
}

export function getCategoryTree(locale: Locale): CategoryNode[] {
  return getRawCategoryTree(locale)
}

export function findCategoryById(
  locale: Locale,
  id: string,
): CategoryNode | undefined {
  return findInTree(getCategoryTree(locale), (node) => node.id === id)
}

export function findCategoryBySlug(
  locale: Locale,
  slug: string,
): CategoryNode | undefined {
  return findInTree(getCategoryTree(locale), (node) => node.slug === slug)
}

function findInTree(
  nodes: CategoryNode[],
  predicate: (node: CategoryNode) => boolean,
): CategoryNode | undefined {
  for (const node of nodes) {
    if (predicate(node)) return node
    const match = findInTree(node.children, predicate)
    if (match) return match
  }
  return undefined
}

function bySkuMap(locale: Locale): Map<string, Product> {
  return new Map(getAllProducts(locale).map((p) => [p.sku, p]))
}

/** All products belonging to a category, including its subtree. */
export function getProductsForCategory(
  locale: Locale,
  categoryId: string,
): Product[] {
  const skus = CATEGORY_INDEX[locale][categoryId]
  if (skus) {
    const bySku = bySkuMap(locale)
    return skus
      .map((sku) => bySku.get(sku))
      .filter((p): p is Product => Boolean(p))
  }
  return getAllProducts(locale).filter((p) =>
    p.categories.some((c) => c.id === categoryId),
  )
}

export function getProduct(
  locale: Locale,
  urlKey: string,
): Product | undefined {
  return getAllProducts(locale).find((p) => p.urlKey === urlKey)
}

export function emptyFilters(): ActiveFilters {
  return { categoryIds: [], colors: [], sizes: [], materials: [], styles: [] }
}

export function hasActiveFilters(filters: ActiveFilters): boolean {
  return (
    filters.categoryIds.length > 0 ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.materials.length > 0 ||
    filters.styles.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined
  )
}

function matchesFilters(
  product: Product,
  filters: ActiveFilters,
  exclude?: keyof ActiveFilters,
): boolean {
  const check = (group: keyof ActiveFilters, values: { value: string }[]) => {
    if (exclude === group) return true
    const selected = filters[group] as string[]
    if (!selected.length) return true
    return values.some((v) => selected.includes(v.value))
  }

  if (exclude !== 'categoryIds' && filters.categoryIds.length) {
    if (!product.categories.some((c) => filters.categoryIds.includes(c.id)))
      return false
  }
  if (!check('colors', product.colors)) return false
  if (!check('sizes', product.sizes)) return false
  if (!check('materials', product.materials)) return false
  if (!check('styles', product.styles)) return false

  if (exclude !== 'minPrice' && exclude !== 'maxPrice') {
    if (filters.minPrice !== undefined && product.price < filters.minPrice)
      return false
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice)
      return false
  }
  return true
}

export function applyFilters(
  products: Product[],
  filters: ActiveFilters,
): Product[] {
  return products.filter((p) => matchesFilters(p, filters))
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products]
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return copy
  }
}

interface CategoryFacetOption {
  id: string
  name: string
}

/**
 * Builds sidebar facets from a product scope. Each group's option counts are
 * computed against the scope filtered by every *other* active group, so
 * unchecking one option never zeroes out the whole list (mirrors Gally's
 * aggregation behaviour).
 */
export function computeFacets(
  scope: Product[],
  filters: ActiveFilters,
  categoryOptions: CategoryFacetOption[],
): Facet[] {
  const facets: Facet[] = []

  const buildCheckboxFacet = (
    field: keyof ActiveFilters,
    label: string,
    extract: (p: Product) => { label: string; value: string }[],
  ): Facet => {
    const candidates = scope.filter((p) => matchesFilters(p, filters, field))
    const counts = new Map<string, FacetOption>()
    for (const product of candidates) {
      for (const opt of extract(product)) {
        const existing = counts.get(opt.value)
        if (existing) existing.count += 1
        else
          counts.set(opt.value, {
            label: opt.label,
            value: opt.value,
            count: 1,
          })
      }
    }
    return {
      field: String(field),
      label,
      type: 'checkbox',
      options: [...counts.values()].sort((a, b) => b.count - a.count),
    }
  }

  const categoryCandidates = scope.filter((p) =>
    matchesFilters(p, filters, 'categoryIds'),
  )
  const categoryCounts = categoryOptions
    .map((opt) => ({
      label: opt.name,
      value: opt.id,
      count: categoryCandidates.filter((p) =>
        p.categories.some((c) => c.id === opt.id),
      ).length,
    }))
    .filter((opt) => opt.count > 0)
  if (categoryCounts.length) {
    facets.push({
      field: 'categoryIds',
      label: 'Category',
      type: 'checkbox',
      options: categoryCounts,
    })
  }

  facets.push(buildCheckboxFacet('sizes', 'Size', (p) => p.sizes))
  facets.push(buildCheckboxFacet('colors', 'Color', (p) => p.colors))
  facets.push(buildCheckboxFacet('materials', 'Material', (p) => p.materials))
  facets.push(buildCheckboxFacet('styles', 'Style', (p) => p.styles))

  const priceCandidates = scope.filter((p) =>
    matchesFilters(p, filters, 'minPrice'),
  )
  const prices = [...new Set(priceCandidates.map((p) => p.price))].sort(
    (a, b) => a - b,
  )
  if (prices.length) {
    facets.push({
      field: 'price',
      label: 'Price',
      type: 'slider',
      options: prices.map((price) => ({
        label: String(price),
        value: String(price),
        count: 1,
      })),
    })
  }

  return facets.filter((f) => f.options.length > 0)
}

function scoreProduct(product: Product, query: string): number {
  const q = query.trim().toLowerCase()
  if (!q) return 0
  let score = 0
  const name = product.name.toLowerCase()
  if (name === q) score += 20
  else if (name.startsWith(q)) score += 12
  else if (name.includes(q)) score += 8

  if (product.categories.some((c) => c.name.toLowerCase().includes(q)))
    score += 4
  const attrs = [
    ...product.colors,
    ...product.sizes,
    ...product.materials,
    ...product.styles,
  ]
  if (attrs.some((a) => a.label.toLowerCase().includes(q))) score += 3

  return score
}

export function searchProducts(locale: Locale, query: string): Product[] {
  return getAllProducts(locale)
    .map((product) => ({ product, score: scoreProduct(product, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product)
}

const termVocabularyCache = new Map<Locale, string[]>()

function buildTermVocabulary(locale: Locale): string[] {
  const cached = termVocabularyCache.get(locale)
  if (cached) return cached

  const terms = new Set<string>()
  for (const product of getAllProducts(locale)) {
    for (const word of product.name.split(/\s+/)) terms.add(word)
    for (const opt of [
      ...product.colors,
      ...product.sizes,
      ...product.materials,
      ...product.styles,
    ]) {
      terms.add(opt.label)
    }
  }
  const collectCategoryNames = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      terms.add(node.name)
      collectCategoryNames(node.children)
    }
  }
  collectCategoryNames(getCategoryTree(locale))

  const vocabulary = [...terms]
  termVocabularyCache.set(locale, vocabulary)
  return vocabulary
}

/** Suggested search terms (query completions), mirroring Gally's termSuggestions. */
export function suggestTerms(locale: Locale, query: string): string[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  return buildTermVocabulary(locale)
    .filter(
      (term) => term.toLowerCase().startsWith(q) && term.toLowerCase() !== q,
    )
    .sort((a, b) => a.length - b.length)
    .slice(0, 6)
}

export interface SearchSuggestions {
  terms: string[]
  products: Product[]
  categories: CategoryNode[]
  attributes: {
    label: string
    value: string
    kind: 'color' | 'size' | 'material' | 'style'
  }[]
}

export function suggest(locale: Locale, query: string): SearchSuggestions {
  const q = query.trim().toLowerCase()
  if (q.length < 2)
    return { terms: [], products: [], categories: [], attributes: [] }

  const products = searchProducts(locale, query).slice(0, 5)

  const categories: CategoryNode[] = []
  const collect = (nodes: CategoryNode[]) => {
    for (const node of nodes) {
      if (node.name.toLowerCase().includes(q)) categories.push(node)
      collect(node.children)
    }
  }
  collect(getCategoryTree(locale))

  const attrMap = new Map<
    string,
    {
      label: string
      value: string
      kind: 'color' | 'size' | 'material' | 'style'
    }
  >()
  for (const product of getAllProducts(locale)) {
    const groups: [
      Product['colors'],
      'color' | 'size' | 'material' | 'style',
    ][] = [
      [product.colors, 'color'],
      [product.sizes, 'size'],
      [product.materials, 'material'],
      [product.styles, 'style'],
    ]
    for (const [options, kind] of groups) {
      for (const opt of options) {
        if (opt.label.toLowerCase().includes(q)) {
          attrMap.set(`${kind}:${opt.value}`, {
            label: opt.label,
            value: opt.value,
            kind,
          })
        }
      }
    }
  }

  return {
    terms: suggestTerms(locale, query),
    products,
    categories: categories.slice(0, 5),
    attributes: [...attrMap.values()].slice(0, 6),
  }
}

/** Products sharing the product's most specific (leaf) category. */
export function getSimilarProducts(
  locale: Locale,
  sku: string,
  count = 6,
): Product[] {
  const product = getAllProducts(locale).find((p) => p.sku === sku)
  if (!product) return []
  const leafCategory = product.categories.find(
    (c) => !TOP_LEVEL_CATEGORY_IDS.includes(c.id),
  )
  if (!leafCategory) return []
  return getProductsForCategory(locale, leafCategory.id)
    .filter((p) => p.sku !== sku)
    .slice(0, count)
}

/** Products from a complementary category (e.g. Tops <-> Bottoms), to pair with the current product. */
export function getCompatibleProducts(
  locale: Locale,
  sku: string,
  count = 6,
): Product[] {
  const product = getAllProducts(locale).find((p) => p.sku === sku)
  if (!product) return []
  const topLevel = product.categories.find((c) =>
    TOP_LEVEL_CATEGORY_IDS.includes(c.id),
  )
  const complementId = topLevel
    ? COMPLEMENTARY_CATEGORY[topLevel.id]
    : undefined
  if (!complementId) return []
  return getProductsForCategory(locale, complementId).slice(0, count)
}

export {
  applyArticleFilters,
  computeArticleFacets,
  emptyArticleFilters,
  getBlog,
  hasActiveArticleFilters,
  searchArticles,
}
