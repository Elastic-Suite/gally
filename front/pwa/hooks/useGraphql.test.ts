import { act, waitFor } from '@testing-library/react'

import { IError, LoadStatus, fetchGraphql, log } from 'shared'
import { renderHookWithProviders } from '~/utils/tests'

import { useApiGraphql, useGraphqlApi } from './useGraphql'

const testQuery = `query {
  catalogs {
    edges {
      node {
        id
      }
    }
  }
}`

describe('useGraphql', () => {
  beforeEach(() => {
    ;(fetchGraphql as jest.Mock).mockClear()
  })

  describe('useApiGraphql', () => {
    it('should return the graphqlFetch function prefilled', async () => {
      ;(fetchGraphql as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useApiGraphql())
      expect(typeof result.current).toEqual('function')
      const json = await result.current(testQuery)
      expect(json).toEqual({ hello: 'world' })
      expect(fetchGraphql).toHaveBeenCalledWith(
        'en',
        testQuery,
        undefined,
        undefined,
        true
      )
    })

    it('should call the log function if any error is thrown', async () => {
      const mock = fetchGraphql as jest.Mock
      mock.mockClear()
      ;(log as jest.Mock).mockClear()
      mock.mockImplementationOnce(() => Promise.reject(new Error('error')))
      const { result } = renderHookWithProviders(() => useApiGraphql())
      const json = await result.current(testQuery)
      expect((json as IError).error.message).toEqual('error')
      expect(log).toHaveBeenCalled()
    })
  })

  describe('useGraphqlApi', () => {
    it('calls and return the api result', async () => {
      ;(fetchGraphql as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useGraphqlApi(testQuery))
      expect(result.current[0]).toEqual({
        status: LoadStatus.LOADING,
      })
      await waitFor(() =>
        expect(result.current[0]).toEqual({
          status: LoadStatus.SUCCEEDED,
          data: { hello: 'world' },
        })
      )
      expect(fetchGraphql).toHaveBeenCalledWith(
        'en',
        testQuery,
        undefined,
        undefined,
        true
      )
    })

    it('should update the data in the response', async () => {
      ;(fetchGraphql as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useGraphqlApi(testQuery))
      await waitFor(() =>
        expect(result.current[0]).toEqual({
          status: LoadStatus.SUCCEEDED,
          data: { hello: 'world' },
        })
      )
      act(() => result.current[1]({ hello: 'foo' }))
      expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'foo' },
      })
    })

    it('should update the data in the response (using an update function)', async () => {
      ;(fetchGraphql as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useGraphqlApi(testQuery))
      await waitFor(() =>
        expect(result.current[0]).toEqual({
          status: LoadStatus.SUCCEEDED,
          data: { hello: 'world' },
        })
      )
      act(() => result.current[1]((data: any) => ({ ...data, foo: 'bar' })))
      expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'world', foo: 'bar' },
      })
    })
  })
})
