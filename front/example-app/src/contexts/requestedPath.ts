import { createContext } from 'react'

export interface IRequestedPathContext {
  requestedPath: string
  setRequestedPath: (requestedPath: string) => void
}

export const requestedPathContext = createContext<IRequestedPathContext>({
  requestedPath: '/',
  setRequestedPath: null,
})
