import { Dispatch, SetStateAction } from 'react'
import { IFetch, IGraphqlSearchProducts, IOptions, SortOrder } from 'shared'

import { IActiveFilters } from './facet'

export interface IProductsHook {
  activeFilters: IActiveFilters
  loadProduts: (condition: boolean) => void
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
