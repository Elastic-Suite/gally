import { createContext } from 'react'

import { IDocumentsHook, IProductsHook } from '../types'

export interface ISearchContext {
  search: string
  onSearch: (search: string) => void
  productSearch: IProductsHook
  cmsPageSearch: IDocumentsHook
}

export const searchContext = createContext<ISearchContext>(null)
