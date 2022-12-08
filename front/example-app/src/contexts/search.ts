import { createContext } from 'react'

import { IProductsHook } from '../types'

export interface ISearchContext extends IProductsHook {
  onSearch: (search: string) => void
}

export const searchContext = createContext<ISearchContext>(null)
