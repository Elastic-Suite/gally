import { fetchApi } from '~/services/api'
import { LoadStatus } from '~/types'
import { renderHookWithProviders } from '~/utils/tests'

import { useApiDispatch, useApiFetch, useApiList, useFetchApi } from './useApi'

jest.mock('~/services/api')

describe('useApi', () => {
  describe('useApiFetch', () => {
    it('should return the apiFetch function with language prefilled', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useApiFetch())
      expect(typeof result.current).toEqual('function')
      const json = await result.current('/test')
      expect(json).toEqual({ hello: 'world' })
      expect(fetchApi).toHaveBeenCalledWith('en', '/test')
    })
  })

  describe('useFetchApi', () => {
    it('calls and return the api result', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result, waitForNextUpdate } = renderHookWithProviders(() =>
        useFetchApi('/test')
      )
      expect(result.current[0]).toEqual({
        status: LoadStatus.LOADING,
      })
      await waitForNextUpdate()
      expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'world' },
      })
      expect(fetchApi).toHaveBeenCalledWith('en', '/test', undefined, undefined)
    })
  })

  describe('useApiDispatch', () => {
    it('calls and return the api result', () => {
      const action = jest.fn()
      // @ts-expect-error use spy
      renderHookWithProviders(() => useApiDispatch(action, '/test'))
      expect(action).toHaveBeenCalledWith({ status: LoadStatus.LOADING })
    })
  })

  describe('useApiList', () => {
    it('calls and return the list result with pagination disabled', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { waitForNextUpdate } = renderHookWithProviders(() =>
        useApiList('/list', false)
      )
      await waitForNextUpdate()
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        '/list',
        { pagination: false, search: '' },
        undefined
      )
    })

    it('calls and return the list result with pagination enabled', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { waitForNextUpdate } = renderHookWithProviders(() =>
        useApiList('/list')
      )
      await waitForNextUpdate()
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        '/list',
        { pagination: true, pageSize: 50, currentPage: 1, search: '' },
        undefined
      )
    })

    it('calls and return the list result with page and filters', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const params = { foo: 'bar' }
      const { waitForNextUpdate } = renderHookWithProviders(() =>
        useApiList('/list', 2, params)
      )
      await waitForNextUpdate()
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        '/list',
        {
          pagination: true,
          pageSize: 50,
          currentPage: 3,
          foo: 'bar',
          search: '',
        },
        undefined
      )
    })
  })
})
