import { Dispatch, SetStateAction, createContext } from 'react'
export const breadcrumbContext =
  createContext<[string[], Dispatch<SetStateAction<string[]>>]>(null)
