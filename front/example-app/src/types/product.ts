import { Dispatch, SetStateAction } from 'react'
import {
  IFetch,
  IGraphqlProductAggregation,
  IGraphqlSearchProducts,
  IOptions,
  SortOrder,
} from 'shared'

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
