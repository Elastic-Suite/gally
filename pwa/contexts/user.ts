import { createContext } from 'react'
import { IUser } from '~/types'
export const userContext = createContext<IUser>(null)
