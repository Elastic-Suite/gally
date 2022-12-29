import { createContext } from 'react'
import { IUser } from 'gally-admin-shared'

export interface IUserContext {
  user: IUser
  setToken: (token: string) => void
}

export const userContext = createContext<IUserContext>({
  user: null,
  setToken: null,
})
