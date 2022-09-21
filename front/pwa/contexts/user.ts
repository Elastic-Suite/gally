import { createContext } from 'react'
import { IUser } from 'shared'
export const userContext = createContext<IUser>(null)
