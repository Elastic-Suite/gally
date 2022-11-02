import { Dispatch, SetStateAction, createContext } from 'react'
import { IFetch, IGraphqlSearchProducts } from 'shared'

export interface ISearchContext {
  onSearch: (search: string) => void
  page: number
  pageSize: number
  products: IFetch<IGraphqlSearchProducts>
  search: string
  setPage: Dispatch<SetStateAction<number>>
  setPageSize: Dispatch<SetStateAction<number>>
}

export const searchContext = createContext<ISearchContext>(null)
