import { Dispatch, SetStateAction, createContext } from 'react'
import { IFetch, IGraphqlSearchProducts, IOptions, SortOrder } from 'shared'

export interface ISearchContext {
  onSearch: (search: string) => void
  page: number
  pageSize: number
  products: IFetch<IGraphqlSearchProducts>
  search: string
  setPage: Dispatch<SetStateAction<number>>
  setPageSize: Dispatch<SetStateAction<number>>
  setSort: Dispatch<SetStateAction<string>>
  setSortOrder: Dispatch<SetStateAction<SortOrder>>
  sort: string
  sortOptions: IOptions<string>
  sortOrder: SortOrder
}

export const searchContext = createContext<ISearchContext>(null)
