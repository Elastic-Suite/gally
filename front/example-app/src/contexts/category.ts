import { createContext } from 'react'
import { ICategory } from 'gally-admin-shared'

export const categoryContext = createContext<ICategory[]>([])
