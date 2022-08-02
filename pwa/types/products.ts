import { IScore, IStock } from '.'
import { ISearchParameters } from '~/types'

export interface ISearchProducts {
  searchProducts: ISearchProduct
}

export interface ISearchProduct {
  collection: IProduct[]
  paginationInfo: IProductPaginationInfo
}

export interface IFetchProducts {
  data: ISearchProducts
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
