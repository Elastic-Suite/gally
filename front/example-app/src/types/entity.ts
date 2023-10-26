import { IActiveFilters, IFilterMoreOptions } from './facet'
import {
  IGraphqlAggregation,
  IOptions,
  SortOrder,
} from '@elastic-suite/gally-admin-shared'
import { Dispatch, SetStateAction } from 'react'

export interface IEntitiesHook {
  activeFilters: IActiveFilters
  loadMore: (filter: IGraphqlAggregation) => void
  moreOptions: IFilterMoreOptions
  page: number
  pageSize: number
  setActiveFilters: Dispatch<SetStateAction<IActiveFilters>>
  setPage: Dispatch<SetStateAction<number>>
  setPageSize: Dispatch<SetStateAction<number>>
  setSort: Dispatch<SetStateAction<string>>
  setSortOrder: Dispatch<SetStateAction<SortOrder>>
  sort: string
  sortOptions: IOptions<string>
  sortOrder: SortOrder
}
