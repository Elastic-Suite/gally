import fetchMock from 'fetch-mock-jest'

import { resource } from '~/mocks'

import {
  fetchApi,
  fetchJson,
  getApiUrl,
  normalizeUrl,
  removeEmptyParameters,
} from './api'

describe('Api service', () => {
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
      expect(normalizeUrl('/test')).toEqual('/test')
      expect(normalizeUrl('http://localhost/test')).toEqual(
        'http://localhost/test'
      )
    })

    it('should return the mock URL', () => {
      process.env.NEXT_PUBLIC_LOCAL = 'true'
      expect(normalizeUrl('/test')).toEqual('/test')
      expect(normalizeUrl('http://localhost/test')).toEqual(
        'http://localhost/mocks/test.json'
      )
    })
  })

  describe('getApiUrl', () => {
    it('should return the api URL', () => {
      expect(getApiUrl('')).toEqual('http://localhost/')
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
      fetchMock.get(url, { hello: 'world' })
      const response = await fetchJson('http://localhost/test')
      expect(response).toMatchObject({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })
  })

  describe('fetchApi', () => {
    it('should fetch requested api from url', async () => {
      const url = 'http://localhost/test'
      fetchMock.get(url, { hello: 'world' })
      const json = await fetchApi('en', '/test')
      expect(json).toEqual({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })

    it('should fetch requested api from resource', async () => {
      const url = 'https://localhost/metadata'
      fetchMock.get(url, { hello: 'world' })
      const json = await fetchApi('en', resource)
      expect(json).toEqual({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })
  })

  describe('removeEmptyParameters', () => {
    it('should remove empty parameters', () => {
      expect(removeEmptyParameters({ foo: null, bar: '', baz: 42 })).toEqual({
        baz: 42,
      })
    })
  })
})
