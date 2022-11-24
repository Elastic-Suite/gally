import { IPrice, IStock } from './customTables'
import { ISearchParameters } from './fetch'

export enum ProductRequestType {
  CATALOG = 'product_catalog',
  SEARCH = 'product_search',
}

export interface IGraphqlSearchProducts {
  products: IGraphqlSearchProduct
}

export interface IGraphqlSearchProduct {
  collection: IGraphqlProduct[]
  paginationInfo: IGraphqlProductPaginationInfo
}

export interface IGraphqlProduct {
  id: string
  price?: IPrice[]
  sku: string
  name: string
  brand?: string
  stock: IStock
  score: number
}

export interface IGraphqlProductPaginationInfo {
  lastPage: number
  totalCount: number
}

export interface IFetchParams {
  options: RequestInit
  searchParameters: ISearchParameters
}

export interface IProductBoolFilterInput {
  _must?: IProductFieldFilterInput[]
  _should?: IProductFieldFilterInput[]
  _not?: IProductFieldFilterInput[]
}

export interface IProductTextTypeFilterInput {
  eq?: string
  in?: string[]
  match?: string
  exist?: boolean
}

export interface ISelectTypeDefaultFilterInputType {
  eq?: string
  in?: string[]
  exist?: boolean
}

export interface IProductIntegerTypeFilterInput {
  eq?: number
  in?: number[]
  gte?: number
  gt?: number
  lt?: number
  lte?: number
  exist?: boolean
}

export interface IProductFieldFilterInput {
  boolFilter?: IProductBoolFilterInput
  category__id?: IProductTextTypeFilterInput
  accessory_brand__value?: ISelectTypeDefaultFilterInputType
  accessory_gemstone_addon__value?: ISelectTypeDefaultFilterInputType
  accessory_recyclable_material__value?: ISelectTypeDefaultFilterInputType
  color__value?: ISelectTypeDefaultFilterInputType
  fashion_color__value?: ISelectTypeDefaultFilterInputType
  fashion_material__value?: ISelectTypeDefaultFilterInputType
  fashion_size__value?: ISelectTypeDefaultFilterInputType
  fashion_style__value?: ISelectTypeDefaultFilterInputType
  has_video__value?: ISelectTypeDefaultFilterInputType
  manufacturer__value?: ISelectTypeDefaultFilterInputType
  image?: IProductTextTypeFilterInput
  sku?: IProductTextTypeFilterInput
  name?: IProductTextTypeFilterInput
  id?: IProductIntegerTypeFilterInput
}
