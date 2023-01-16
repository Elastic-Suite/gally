import { createContext } from 'react'
import { ICategory } from '@elastic-suite/gally-admin-shared'

export const categoryContext = createContext<ICategory[]>([])
