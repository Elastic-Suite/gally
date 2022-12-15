import { SortOrder } from './categorySortingOption'
import { IPrice, IStock } from './customTables'
import { ISearchParameters } from './fetch'

export enum ProductRequestType {
  CATALOG = 'product_catalog',
  SEARCH = 'product_search',
  COVERAGE_RATE = 'product_coverage_rate',
}

export interface IGraphqlSearchProductsVariables {
  catalogId: string
  currentCategoryId?: string
  currentPage?: number
  filter?: IProductFieldFilterInput[] | IProductFieldFilterInput
  pageSize?: number
  requestType: ProductRequestType
  search?: string
  sort?: Record<string, SortOrder>
}

export enum AggregationType {
  BOOLEAN = 'boolean',
  CATEGORY = 'category',
  CHECKBOX = 'checkbox',
  SLIDER = 'slider',
}

export interface IGraphqlSearchProducts {
  products: IGraphqlSearchProduct
}

export interface IGraphqlSearchProduct {
  collection: IGraphqlProduct[]
  paginationInfo: IGraphqlProductPaginationInfo
  sortInfo: IGraphqlProductSortInfo
  aggregations?: IGraphqlProductAggregation[]
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

export interface IGraphqlProductSortInfo {
  current: IGraphqlProductSortInfoCurrent[]
}

export interface IGraphqlProductSortInfoCurrent {
  field: string
  direction: SortOrder
}

export interface IGraphqlProductAggregation {
  count: number
  field: string
  label: string
  type: AggregationType
  options: IGraphqlProductAggregationOption[]
  hasMore: boolean | null
}

export interface IGraphqlProductAggregationOption {
  count: number
  label: string
  value: string
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

export interface ICategoryTypeDefaultFilterInputType {
  eq: string
}

export interface IStockTypeDefaultFilterInputType {
  eq?: boolean
  exist?: boolean
}

export interface ISelectTypeDefaultFilterInputType {
  eq?: string
  in?: string[]
  exist?: boolean
}

export interface IEntityTextTypeFilterInput
  extends ISelectTypeDefaultFilterInputType {
  match?: string
}

export interface IEntityIntegerTypeFilterInput {
  eq?: number
  in?: number[]
  gte?: number
  gt?: number
  lt?: number
  lte?: number
  exist?: boolean
}

export type ITypeFilterInput =
  | IEntityIntegerTypeFilterInput
  | IEntityTextTypeFilterInput
  | ISelectTypeDefaultFilterInputType
  | IStockTypeDefaultFilterInputType
  | ICategoryTypeDefaultFilterInputType
  | IProductBoolFilterInput

export interface IProductFieldFilterInput {
  boolFilter?: IProductBoolFilterInput
  [key: string]: ITypeFilterInput
}
