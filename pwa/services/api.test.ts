import fetchMock from 'fetch-mock-jest'
import { fetchApi } from './api'

describe('Api service', () => {
  describe('fetchApi', () => {
    const OLD_ENV = process.env

    beforeEach(() => {
      jest.resetModules()
      process.env = { ...OLD_ENV }
    })

    afterAll(() => {
      process.env = OLD_ENV
    })

    it('should fetch requested api', async () => {
      const url = '/test'
      fetchMock.get(url, { hello: 'world' })
      const response = await fetchApi('en', '/test')
      expect(response).toEqual({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })

    it('should fetch requested mock', async () => {
      process.env.NEXT_PUBLIC_LOCAL = 'true'
      const url = '/mocks/test.json'
      fetchMock.get(url, { hello: 'world' })
      const response = await fetchApi('en', '/test')
      expect(response).toEqual({ hello: 'world' })
      expect(fetchMock.called(url)).toEqual(true)
      fetchMock.restore()
    })
  })
})
