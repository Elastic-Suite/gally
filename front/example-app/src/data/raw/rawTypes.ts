/**
 * Shapes mirroring the real Gally GraphQL schema (introspected from
 * https://stable.gally.dev/api/graphql). Kept close to the wire format so
 * swapping this static fixture for a live SDK/GraphQL call later only means
 * replacing `catalogService.ts`, not the rest of the app.
 */

export interface RawAttributeOption {
  label: string
  value: string
}

export interface RawProductCategory {
  id: string
  name: string
  is_parent: boolean
}

export interface RawProduct {
  sku: string
  name: string
  description: string | null
  image: string
  url_key: string
  price: { price: number; original_price: number; is_discounted: boolean }[]
  fashion_color: RawAttributeOption[] | null
  fashion_size: RawAttributeOption[] | null
  fashion_style: RawAttributeOption[] | null
  fashion_material: RawAttributeOption[] | null
  category: RawProductCategory[]
  stock: { status: boolean; qty: number }
}

export interface RawCategoryNode {
  id: string
  name: string
  level: number
  path: string
  isVirtual: boolean
  count: number
  image: string | null
  children?: RawCategoryNode[]
}
