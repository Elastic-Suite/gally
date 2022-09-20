import { act, waitFor } from '@testing-library/react'

import {
  IFetchError,
  IHydraMember,
  LoadStatus,
  fetchApi,
  log,
  resource,
} from 'shared'
import { renderHookWithProviders } from '~/utils/tests'

import {
  useApiEditableList,
  useApiFetch,
  useApiList,
  useFetchApi,
} from './useApi'

jest.mock('shared')

interface ITest extends IHydraMember {
  hello: string
}

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

    it('should call the log function if any error is thrown', async () => {
      const mock = fetchApi as jest.Mock
      mock.mockClear()
      ;(log as jest.Mock).mockClear()
      mock.mockImplementationOnce(() => Promise.reject(new Error('error')))
      const { result } = renderHookWithProviders(() => useApiFetch())
      const json = await result.current('/test')
      expect((json as IFetchError).error.message).toEqual('error')
      expect(log).toHaveBeenCalled()
    })
  })

  describe('useFetchApi', () => {
    it('calls and return the api result', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() =>
        useFetchApi('/test')
      )
      expect(result.current[0]).toEqual({
        status: LoadStatus.LOADING,
      })
      await waitFor(() => expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'world' },
      }))
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
      await waitFor(() => expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'world' },
      }))
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
      const { result } = renderHookWithProviders(() =>
        useFetchApi('/test')
      )
      await waitFor(() => expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'world' },
      }))
      act(() => result.current[1]({ hello: 'foo' }))
      expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'foo' },
      })
    })

    it('should update the data in the response (using an update function)', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() =>
        useFetchApi('/test')
      )
      await waitFor(() => expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'world' },
      }))
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
      await waitFor(() => expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'world' },
      }))
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
      const { result } = renderHookWithProviders(() =>
        useApiList('/list')
      )
      await waitFor(() => expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'world' },
      }))
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
      await waitFor(() => expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { hello: 'world' },
      }))
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
      await waitFor(() => expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { 'hydra:member': [{ id: 0 }] },
      }))
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
      await waitFor(() => expect(result.current[0]).toEqual({
        status: LoadStatus.SUCCEEDED,
        data: { 'hydra:member': [{ id: 0 }] },
      }))
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

  describe('useApiEditableList', () => {
    it('calls and return the list and the resource operations', async () => {
      ;(fetchApi as jest.Mock).mockClear()
      const { result } = renderHookWithProviders(() =>
        useApiEditableList(resource)
      )
      expect(result.current[1]).toMatchObject({
        create: expect.any(Function),
        remove: expect.any(Function),
        replace: expect.any(Function),
        update: expect.any(Function),
      })
      await waitFor(() => expect(result.current[0].data['hydra:member'].length).toEqual(2))
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        resource,
        { pagination: true, pageSize: 50, currentPage: 1 },
        undefined,
        true
      )
    })

    it('should call the API (create)', async () => {
      const { result } = renderHookWithProviders(() =>
        useApiEditableList<ITest>(resource)
      )
      await waitFor(() => expect(result.current[0].data['hydra:member'].length).toEqual(2))
      ;(fetchApi as jest.Mock).mockClear()
      await act(() => result.current[1].create({ hello: 'world' }))
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        'https://localhost/metadata',
        undefined,
        { body: '{"hello":"world"}', method: 'POST' },
        true
      )
    })

    it('should call the API (replace)', async () => {
      const { result } = renderHookWithProviders(() =>
        useApiEditableList<ITest>(resource)
      )
      await waitFor(() => expect(result.current[0].data['hydra:member'].length).toEqual(2))
      ;(fetchApi as jest.Mock).mockClear()
      await act(() => result.current[1].replace({ id: 1, hello: 'world' }))
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        'https://localhost/metadata/1',
        undefined,
        { body: '{"id":1,"hello":"world"}', method: 'PUT' },
        true
      )
    })

    it('should call the API (update)', async () => {
      const { result } = renderHookWithProviders(() =>
        useApiEditableList<ITest>(resource)
      )
      await waitFor(() => expect(result.current[0].data['hydra:member'].length).toEqual(2))
      ;(fetchApi as jest.Mock).mockClear()
      await act(() => result.current[1].update(1, { hello: 'world' }))
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        'https://localhost/metadata/1',
        undefined,
        {
          body: '{"hello":"world"}',
          headers: { 'Content-Type': 'application/merge-patch+json' },
          method: 'PATCH',
        },
        true
      )
    })

    it('should call the API (remove))', async () => {
      const { result } = renderHookWithProviders(() =>
        useApiEditableList<ITest>(resource)
      )
      await waitFor(() => expect(result.current[0].data['hydra:member'].length).toEqual(2))
      ;(fetchApi as jest.Mock).mockClear()
      await act(() => result.current[1].remove(1))
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        'https://localhost/metadata/1',
        undefined,
        { method: 'DELETE' },
        true
      )
    })

    it('should call the API (massUpdate)', async () => {
      const { result } = renderHookWithProviders(() =>
        useApiEditableList<ITest>(resource)
      )
      await waitFor(() => expect(result.current[0].data['hydra:member'].length).toEqual(2))
      ;(fetchApi as jest.Mock).mockClear()
      await act(() => result.current[1].massUpdate([1], { hello: 'world' }))
      expect(fetchApi).toHaveBeenCalledWith(
        'en',
        'https://localhost/metadata/1',
        undefined,
        {
          body: '{"hello":"world"}',
          headers: { 'Content-Type': 'application/merge-patch+json' },
          method: 'PATCH',
        },
        true
      )
    })
  })
})
