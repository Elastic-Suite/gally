import { IConfigurations } from '@elastic-suite/gally-admin-shared'
import { createContext } from 'react'

export const configurationsContext = createContext<IConfigurations>(null)
