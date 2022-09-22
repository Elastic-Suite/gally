import { act, waitFor } from '@testing-library/react'
import { IHydraMember, LoadStatus, fetchApi } from 'shared'

import { renderHookWithProviders } from '../utils/tests'

import { useApiFetch, useApiList, useFetchApi } from './useApi'

describe('useApi', () => {
  beforeEach(() => {
    ;(fetchApi as jest.Mock).mockClear()
  })

  describe('useApiFetch', () => {
    it('should return the apiFetch function prefilled', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useApiFetch())
      expect(typeof result.current).toEqual('function')
      const json = await result.current('/test')
      expect(json).toEqual({ hello: 'world' })
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        '/test',
        undefined,
        undefined,
        true
      )
    })
  })

  describe('useFetchApi', () => {
    it('calls and return the api result', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useFetchApi('/test'))
      expect(result.current[0]).toEqual({
        status: LoadStatus.LOADING,
      })
      await waitFor(() =>
        expect(result.current[0]).toEqual({
          status: LoadStatus.SUCCEEDED,
          data: { hello: 'world' },
        })
      )
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        '/test',
        undefined,
        undefined,
        true
      )
    })

    it('calls and return the api result with options', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const options: RequestInit = {
        body: 'gqlQuery',
      }
      const { result } = renderHookWithProviders(() =>
        useFetchApi('/test', null, options)
      )
      expect(result.current[0]).toEqual({
        status: LoadStatus.LOADING,
      })
      await waitFor(() =>
        expect(result.current[0]).toEqual({
          status: LoadStatus.SUCCEEDED,
          data: { hello: 'world' },
        })
      )
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        '/test',
        null,
        {
          body: 'gqlQuery',
        },
        true
      )
    })

    it('should update the data in the response', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useFetchApi('/test'))
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
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useFetchApi('/test'))
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

  describe('useApiList', () => {
    it('calls and return the list result with pagination disabled', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() =>
        useApiList('/list', false)
      )
      await waitFor(() =>
        expect(result.current[0]).toEqual({
          status: LoadStatus.SUCCEEDED,
          data: { hello: 'world' },
        })
      )
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        '/list',
        { pagination: false },
        undefined,
        true
      )
    })

    it('calls and return the list result with pagination enabled', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() => useApiList('/list'))
      await waitFor(() =>
        expect(result.current[0]).toEqual({
          status: LoadStatus.SUCCEEDED,
          data: { hello: 'world' },
        })
      )
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        '/list',
        { pagination: true, pageSize: 50, currentPage: 1 },
        undefined,
        true
      )
    })

    it('calls and return the list result with page and filters', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const params = { foo: 'bar' }
      const { result } = renderHookWithProviders(() =>
        useApiList('/list', 2, undefined, params)
      )
      await waitFor(() =>
        expect(result.current[0]).toEqual({
          status: LoadStatus.SUCCEEDED,
          data: { hello: 'world' },
        })
      )
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        '/list',
        {
          pagination: true,
          pageSize: 50,
          currentPage: 3,
          foo: 'bar',
        },
        undefined,
        true
      )
    })

    it('should update the list', async () => {
      const mock = fetchApi as jest.Mock
      mock.mockClear()
      mock.mockImplementationOnce(() =>
        Promise.resolve({ 'hydra:member': [{ id: 0 }] })
      )
      const { result } = renderHookWithProviders(() =>
        useApiList('/list', false)
      )
      await waitFor(() =>
        expect(result.current[0]).toEqual({
          status: LoadStatus.SUCCEEDED,
          data: { 'hydra:member': [{ id: 0 }] },
        })
      )
      act(() => result.current[1]([{ id: 1 } as unknown as IHydraMember]))
      expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { 'hydra:member': [{ id: 1 }] },
      })
    })

    it('should update the list (using an update function)', async () => {
      const mock = fetchApi as jest.Mock
      mock.mockClear()
      mock.mockImplementationOnce(() =>
        Promise.resolve({ 'hydra:member': [{ id: 0 }] })
      )
      const { result } = renderHookWithProviders(() =>
        useApiList('/list', false)
      )
      await waitFor(() =>
        expect(result.current[0]).toEqual({
          status: LoadStatus.SUCCEEDED,
          data: { 'hydra:member': [{ id: 0 }] },
        })
      )
      act(() =>
        result.current[1]((list) =>
          list.concat([{ id: 1 } as unknown as IHydraMember])
        )
      )
      expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { 'hydra:member': [{ id: 0 }, { id: 1 }] },
      })
    })
  })
})
