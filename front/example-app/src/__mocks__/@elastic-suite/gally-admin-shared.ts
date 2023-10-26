import { createContext } from 'react'

export * from '@elastic-suite/gally-admin-shared/src/types'
export * from '@elastic-suite/gally-admin-shared/src/services/format'
export * from '@elastic-suite/gally-admin-shared/src/constants'

export const schemaContext = createContext({})

export const fetchApi = jest.fn(() => Promise.resolve({ hello: 'world' }))
export const fetchGraphql = jest.fn(() => Promise.resolve({ hello: 'world' }))
export const getListApiParameters = jest.fn()
export const getResource = jest.fn()
export const getSearchProductsQuery = jest.fn()
export const getUser = jest.fn()
export const isError = jest.fn()
export const log = jest.fn()
export const storageGet = jest.fn()
export const storageSet = jest.fn()
