import { slugify } from '../lib/slug'
import type { CategoryNode, Product } from './types'
import type { RawCategoryNode, RawProduct } from './raw/rawTypes'

const MEDIA_BASE = 'https://stable.gally.dev/media/catalog/product'

export function resolveProductImage(path: string): string {
  return `${MEDIA_BASE}${path}`
}

export function normalizeProduct(raw: RawProduct): Product {
  const price = raw.price[0]
  return {
    sku: raw.sku,
    name: raw.name,
    description: raw.description ?? '',
    image: resolveProductImage(raw.image),
    urlKey: raw.url_key,
    price: price?.price ?? 0,
    originalPrice: price?.original_price ?? price?.price ?? 0,
    isDiscounted: price?.is_discounted ?? false,
    inStock: raw.stock.status,
    qty: raw.stock.qty,
    colors: raw.fashion_color ?? [],
    sizes: raw.fashion_size ?? [],
    styles: raw.fashion_style ?? [],
    materials: raw.fashion_material ?? [],
    categories: raw.category.map((c) => ({
      id: c.id,
      name: c.name,
      isParent: c.is_parent,
    })),
  }
}

export function normalizeCategoryTree(raw: RawCategoryNode[]): CategoryNode[] {
  return raw.map(normalizeCategoryNode)
}

function normalizeCategoryNode(raw: RawCategoryNode): CategoryNode {
  return {
    id: raw.id,
    name: raw.name,
    slug: slugify(raw.name),
    level: raw.level,
    isVirtual: raw.isVirtual,
    count: raw.count,
    image: raw.image ? resolveProductImage(raw.image) : null,
    children: (raw.children ?? []).map(normalizeCategoryNode),
  }
}
