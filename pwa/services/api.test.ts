import fetchMock from 'fetch-mock-jest'

import { resource } from '~/mocks'

import {
  ApiError,
  fetchApi,
  fetchJson,
  getApiUrl,
  isApiError,
  normalizeUrl,
  removeEmptyParameters,
} from './api'

describe('Api service', () => {
  describe('isApiError', () => {
    it('should check if response is an API error', () => {
      expect(isApiError({ code: 401, message: 'Unauthorized' })).toEqual(true)
      expect(isApiError({ hello: 'world' })).toEqual(false)
    })
  })

  describe('normalizeUrl', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...OLD_ENV }
    })

    afterAll(() => {
      process.env = OLD_ENV
    })

    it('should do nothing if not on local environment', () => {
      expect(normalizeUrl()).toEqual('')
      expect(normalizeUrl('/test')).toEqual('/test')
      expect(normalizeUrl('http://localhost/')).toEqual('http://localhost/')
      expect(normalizeUrl('http://localhost/test')).toEqual(
        'http://localhost/test'
      )
      expect(normalizeUrl('http://localhost/mocks/test.json')).toEqual(
        'http://localhost/mocks/test.json'
      )
      expect(normalizeUrl('http://localhost/docs.jsonld')).toEqual(
        'http://localhost/docs.jsonld'
      )
      expect(normalizeUrl('http://example.com/test')).toEqual(
        'http://example.com/test'
      )
    })

    it('should return the mock URL', () => {
      process.env.NEXT_PUBLIC_LOCAL = 'true'
      expect(normalizeUrl()).toEqual('')
      expect(normalizeUrl('/test')).toEqual('/test')
      expect(normalizeUrl('http://localhost/')).toEqual(
        'http://localhost/mocks/index.json'
      )
      expect(normalizeUrl('http://localhost/test')).toEqual(
        'http://localhost/mocks/test.json'
      )
      expect(normalizeUrl('http://localhost/mocks/test.json')).toEqual(
        'http://localhost/mocks/test.json'
      )
      expect(normalizeUrl('http://localhost/docs.jsonld')).toEqual(
        'http://localhost/mocks/docs.json'
      )
      expect(normalizeUrl('http://example.com/test')).toEqual(
        'http://example.com/test'
      )
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

  describe('fetchJson', () => {
    it('should fetch requested url and returns json', async () => {
      const url = 'http://localhost/test'
      fetchMock.once(url, { hello: 'world' })
      const result = await fetchJson('http://localhost/test')
      expect(result.response.status).toEqual(200)
      expect(result.json).toMatchObject({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })
  })

  describe('fetchApi', () => {
    it('should fetch requested api from url', async () => {
      const url = 'http://localhost/test'
      fetchMock.once(url, { hello: 'world' })
      const json = await fetchApi('en', '/test')
      expect(json).toEqual({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })

    it('should fetch requested api from resource', async () => {
      const url = 'https://localhost/metadata'
      fetchMock.once(url, { hello: 'world' })
      const json = await fetchApi('en', resource)
      expect(json).toEqual({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })

    it('should throw an error (API error)', async () => {
      const url = 'http://localhost/restricted'
      fetchMock.once(url, { code: 401, message: 'Unauthorized' })
      await expect(fetchApi('en', '/restricted')).rejects.toThrow(ApiError)
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
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
