import fetchMock from 'fetch-mock-jest'

import { fetchJson, isFetchError, normalizeUrl } from './fetch'

jest.mock('../services/storage')

describe('Fetch service', () => {
  describe('isFetchError', () => {
    it('should check if response is a fetch error', () => {
      expect(isFetchError({ error: 'Unauthorized' })).toEqual(true)
      expect(isFetchError({ hello: 'world' })).toEqual(false)
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

  describe('fetchJson', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...OLD_ENV }
    })

    afterAll(() => {
      process.env = OLD_ENV
    })

    it('should fetch requested url and returns json', async () => {
      const url = 'http://localhost/test'
      fetchMock.once(url, { hello: 'world' })
      const result = await fetchJson('http://localhost/test')
      expect(result.response.status).toEqual(200)
      expect(result.json).toMatchObject({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })

    it('should fetch mock url', async () => {
      process.env.NEXT_PUBLIC_LOCAL = 'true'
      const url = 'http://localhost/mocks/test.json'
      fetchMock.once(url, { hello: 'world' })
      const result = await fetchJson('http://localhost/test')
      expect(result.response.status).toEqual(200)
      expect(result.json).toMatchObject({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })

    it('should not fetch mock url if method id not GET', async () => {
      process.env.NEXT_PUBLIC_LOCAL = 'true'
      const url = 'http://localhost/test'
      fetchMock.once(url, { hello: 'world' })
      const result = await fetchJson('http://localhost/test', {
        method: 'POST',
      })
      expect(result.response.status).toEqual(200)
      expect(result.json).toMatchObject({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })
  })
})
