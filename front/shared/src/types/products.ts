import { IScore, IStock } from './customTables'
import { ISearchParameters } from './fetch'

export interface ISearchProducts {
  searchProducts: ISearchProduct
}

export interface ISearchProduct {
  collection: IProduct[]
  paginationInfo: IProductPaginationInfo
}

export interface IProduct {
  id: string
  price: string
  sku: string
  name: string
  brand: string
  stock: IStock
  score: IScore
}

export interface IProductPaginationInfo {
  lastPage: number
  totalCount: number
}

export interface IFetchParams {
  options: RequestInit
  searchParameters: ISearchParameters
}
