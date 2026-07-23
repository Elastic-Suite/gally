export type Locale = 'fr' | 'en'

export type Country = 'US' | 'DE' | 'FR' | 'GB'

export interface AttributeOption {
  label: string
  value: string
}

export interface ProductCategoryRef {
  id: string
  name: string
  isParent: boolean
}

export interface Product {
  sku: string
  name: string
  description: string
  image: string
  urlKey: string
  price: number
  originalPrice: number
  isDiscounted: boolean
  inStock: boolean
  qty: number
  colors: AttributeOption[]
  sizes: AttributeOption[]
  styles: AttributeOption[]
  materials: AttributeOption[]
  categories: ProductCategoryRef[]
}

export interface CategoryNode {
  id: string
  name: string
  slug: string
  level: number
  isVirtual: boolean
  count: number
  image: string | null
  children: CategoryNode[]
}

export type FacetType = 'checkbox' | 'slider' | 'boolean'

export interface FacetOption {
  label: string
  value: string
  count: number
}

export interface Facet {
  field: string
  label: string
  type: FacetType
  options: FacetOption[]
}

export interface ActiveFilters {
  categoryIds: string[]
  colors: string[]
  sizes: string[]
  materials: string[]
  styles: string[]
  minPrice?: number
  maxPrice?: number
}

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc'

export interface CartLine {
  sku: string
  urlKey: string
  name: string
  image: string
  price: number
  color?: AttributeOption
  size?: AttributeOption
  qty: number
}

export interface BlogArticle {
  slug: string
  section: string
  title: string
  excerpt: string
  body: string[]
  heroImage: string
  relatedCategoryIds: string[]
  relatedSkus: string[]
}

export interface BlogSection {
  slug: string
  title: string
  articles: BlogArticle[]
}

export interface ArticleFilters {
  sections: string[]
  categoryIds: string[]
}
