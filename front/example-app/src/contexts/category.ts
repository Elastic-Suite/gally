import { createContext } from 'react'
import { ICategory } from 'shared'

export const categoryContext = createContext<ICategory[]>([])
