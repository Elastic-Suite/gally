import { resource } from '../mocks'
import { fetchJson } from '../services/fetch'
import { storageGet, storageRemove } from '../services/storage'

import {
  ApiError,
  fetchApi,
  getApiUrl,
  isApiError,
  removeEmptyParameters,
} from './api'
import { HydraError } from './hydra'
import { AuthError } from './network'

jest.mock('../services/fetch')
jest.mock('../services/storage')

describe('Api service', () => {
  describe('isApiError', () => {
    it('should check if response is an API error', () => {
      expect(isApiError({ code: 401, message: 'Unauthorized' })).toEqual(true)
      expect(isApiError({ hello: 'world' })).toEqual(false)
    })
  })

  describe('getApiUrl', () => {
    it('should return the api URL', () => {
      expect(getApiUrl()).toEqual('http://localhost/')
      expect(getApiUrl('/test')).toEqual('http://localhost/test')
      expect(getApiUrl('test')).toEqual('http://localhost/test')
      expect(getApiUrl('http://localhost/test')).toEqual(
        'http://localhost/test'
      )
    })
  })

  describe('fetchApi', () => {
    it('should fetch requested api from url', async () => {
      ;(fetchJson as jest.Mock).mockClear()
      const json = await fetchApi('en', '/test')
      expect(json).toEqual({ hello: 'world' })
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/test', {
        headers: {
          'Content-Type': 'application/json',
          'Elasticsuite-Language': 'en',
        },
      })
    })

    it('should fetch requested api from resource', async () => {
      ;(fetchJson as jest.Mock).mockClear()
      const json = await fetchApi('en', resource)
      expect(json).toEqual({ hello: 'world' })
      expect(fetchJson).toHaveBeenCalledWith('https://localhost/metadata', {
        headers: {
          'Content-Type': 'application/json',
          'Elasticsuite-Language': 'en',
        },
      })
    })

    it('should add auth header if user is connected', async () => {
      const mock = storageGet as jest.Mock
      mock.mockClear()
      ;(fetchJson as jest.Mock).mockClear()
      mock.mockImplementationOnce(() => 'token')
      const json = await fetchApi('en', '/test')
      expect(json).toEqual({ hello: 'world' })
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/test', {
        headers: {
          Authorization: 'Bearer token',
          'Content-Type': 'application/json',
          'Elasticsuite-Language': 'en',
        },
      })
    })

    it('should throw an error (ApiError)', async () => {
      const mock = fetchJson as jest.Mock
      mock.mockClear()
      mock.mockImplementationOnce(() =>
        Promise.resolve({ json: { code: 401, message: 'Unauthorized' } })
      )
      await expect(fetchApi('en', '/restricted')).rejects.toThrow(ApiError)
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/restricted', {
        headers: {
          'Content-Type': 'application/json',
          'Elasticsuite-Language': 'en',
        },
      })
    })

    it('should throw an error (HydraError)', async () => {
      const mock = fetchJson as jest.Mock
      mock.mockClear()
      mock.mockImplementationOnce(() =>
        Promise.resolve({ json: { '@type': 'hydra:Error' } })
      )
      await expect(fetchApi('en', '/restricted')).rejects.toThrow(HydraError)
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/restricted', {
        headers: {
          'Content-Type': 'application/json',
          'Elasticsuite-Language': 'en',
        },
      })
    })

    it('should throw an error and remove token from storage (AuthError)', async () => {
      const mock = fetchJson as jest.Mock
      mock.mockClear()
      ;(storageRemove as jest.Mock).mockClear()
      mock.mockImplementationOnce(() =>
        Promise.resolve({ json: {}, response: { status: 401 } })
      )
      await expect(fetchApi('en', '/restricted')).rejects.toThrow(AuthError)
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/restricted', {
        headers: {
          'Content-Type': 'application/json',
          'Elasticsuite-Language': 'en',
        },
      })
      expect(storageRemove).toHaveBeenCalledWith('elasticSuiteToken')
    })
  })

  describe('removeEmptyParameters', () => {
    it('should remove empty parameters', () => {
      expect(removeEmptyParameters()).toEqual({})
      expect(removeEmptyParameters({ foo: null, bar: '', baz: 42 })).toEqual({
        baz: 42,
      })
    })
  })
})
