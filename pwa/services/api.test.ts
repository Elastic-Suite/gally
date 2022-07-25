import fetchMock from 'fetch-mock-jest'

import { resource } from '~/mocks'

import { fetchApi, getApiUrl } from './api'

describe('Api service', () => {
  describe('getApiUrl', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...OLD_ENV }
    })

    afterAll(() => {
      process.env = OLD_ENV
    })

    it('should return the api URL', () => {
      expect(getApiUrl('')).toEqual('/')
      expect(getApiUrl('/test')).toEqual('/test')
      expect(getApiUrl('test')).toEqual('/test')
      expect(getApiUrl('http://localhost/test')).toEqual(
        'http://localhost/test'
      )
    })

    it('should return the local URL', () => {
      process.env.NEXT_PUBLIC_LOCAL = 'true'
      expect(getApiUrl('')).toEqual('/mocks/')
      expect(getApiUrl('/test')).toEqual('/mocks/test.json')
      expect(getApiUrl('test')).toEqual('/mocks/test.json')
      expect(getApiUrl('http://localhost/test')).toEqual(
        'http://localhost/test.json'
      )
    })
  })

  describe('fetchApi', () => {
    it('should fetch requested api from url', async () => {
      const url = '/test'
      fetchMock.get(url, { hello: 'world' })
      const response = await fetchApi('en', '/test')
      expect(response).toEqual({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })

    it('should fetch requested api from resource', async () => {
      const url = 'http://localhost:3000/mocks/metadata'
      fetchMock.get(url, { hello: 'world' })
      const response = await fetchApi('en', resource)
      expect(response).toEqual({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })
  })
})
