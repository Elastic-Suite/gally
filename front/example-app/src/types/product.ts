import { Dispatch, SetStateAction } from 'react'
import {
  IFetch,
  IGraphqlProduct,
  IGraphqlProductAggregation,
  IGraphqlSearchProducts,
  IOptions,
  SortOrder,
} from '@elastic-suite/gally-admin-shared'

import { IActiveFilters, IFilterMoreOptions } from './facet'

export interface IProductsHook {
  activeFilters: IActiveFilters
  loadMore: (filter: IGraphqlProductAggregation) => void
  loadProducts: (condition: boolean) => void
  moreOptions: IFilterMoreOptions
  page: number
  pageSize: number
  products: IFetch<IGraphqlSearchProducts>
  search: string
  setActiveFilters: Dispatch<SetStateAction<IActiveFilters>>
  setPage: Dispatch<SetStateAction<number>>
  setPageSize: Dispatch<SetStateAction<number>>
  setSearch: Dispatch<SetStateAction<string>>
  setSort: Dispatch<SetStateAction<string>>
  setSortOrder: Dispatch<SetStateAction<SortOrder>>
  sort: string
  sortOptions: IOptions<string>
  sortOrder: SortOrder
}

export interface IProduct extends Omit<IGraphqlProduct, 'price'> {
  price?: number
  image?: string
}

export interface IProductAutoComplete extends IProduct {
  type?: 'product'
}
