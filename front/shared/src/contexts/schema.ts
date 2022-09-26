import { createContext } from 'react'

import { IApi } from '../types'

export const schemaContext = createContext<IApi>(null)
