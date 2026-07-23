import productsFr from './raw/products.fr.json'
import productsEn from './raw/products.en.json'
import categoryTreeFr from './raw/categoryTree.fr.json'
import categoryTreeEn from './raw/categoryTree.en.json'
import { normalizeCategoryTree, normalizeProduct } from './normalize'
import type { Locale, Product, CategoryNode } from './types'
import type { RawCategoryNode, RawProduct } from './raw/rawTypes'

const PRODUCTS_BY_LOCALE: Record<Locale, Product[]> = {
  fr: (productsFr as RawProduct[]).map(normalizeProduct),
  en: (productsEn as RawProduct[]).map(normalizeProduct),
}

const CATEGORY_TREE_BY_LOCALE: Record<Locale, CategoryNode[]> = {
  fr: normalizeCategoryTree(categoryTreeFr as RawCategoryNode[]),
  en: normalizeCategoryTree(categoryTreeEn as RawCategoryNode[]),
}

export function getAllProducts(locale: Locale): Product[] {
  return PRODUCTS_BY_LOCALE[locale]
}

export function getCategoryTree(locale: Locale): CategoryNode[] {
  return CATEGORY_TREE_BY_LOCALE[locale]
}
