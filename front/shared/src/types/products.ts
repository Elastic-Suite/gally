import { IPrice, IStock } from './customTables'
import { ISearchParameters } from './fetch'

export interface IGraphqlSearchProducts {
  searchProducts: IGraphqlSearchProduct
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
