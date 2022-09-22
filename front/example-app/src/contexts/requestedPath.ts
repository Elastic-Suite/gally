import { createContext } from 'react'

interface IRequestedPathContext {
  requestedPath: string
  setRequestedPath: (requestedPath: string) => void
}

export const requestedPathContext = createContext<IRequestedPathContext>({
  requestedPath: '/',
  setRequestedPath: null,
})
