import { fetchJson } from '../services/fetch'

import { GraphqlError, fetchGraphql, isGraphqlError } from './graphql'
import { AuthError } from './network'

jest.mock('../services/fetch')

const testQuery = `query {
  catalogs {
    edges {
      node {
        id
      }
    }
  }
}`

describe('Graphql service', () => {
  describe('isGraphqlError', () => {
    it('should check if response is an API error', () => {
      expect(isGraphqlError({ errors: [] })).toEqual(true)
      expect(isGraphqlError({ hello: 'world' })).toEqual(false)
    })
  })

  describe('fetchGraphql', () => {
    it('should fetch requested query', async () => {
      ;(fetchJson as jest.Mock).mockClear()
      await fetchGraphql('en', testQuery)
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/graphql', {
        headers: {
          'Content-Type': 'application/json',
          'Elasticsuite-Language': 'en',
        },
        body: JSON.stringify({
          query: testQuery,
        }),
        method: 'POST',
      })
    })

    it('should throw an error (GraphqlError)', async () => {
      const mock = fetchJson as jest.Mock
      mock.mockImplementationOnce(() =>
        Promise.resolve({ json: { errors: [{ message: 'error' }] } })
      )
      await expect(fetchGraphql('en', testQuery)).rejects.toThrow(GraphqlError)
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/graphql', {
        headers: {
          'Content-Type': 'application/json',
          'Elasticsuite-Language': 'en',
        },
        body: JSON.stringify({
          query: testQuery,
        }),
        method: 'POST',
      })
    })

    it('should throw an (AuthError)', async () => {
      const mock = fetchJson as jest.Mock
      mock.mockImplementationOnce(() =>
        Promise.resolve({ json: {}, response: { status: 401 } })
      )
      await expect(fetchGraphql('en', testQuery)).rejects.toThrow(AuthError)
      expect(fetchJson).toHaveBeenCalledWith('http://localhost/graphql', {
        headers: {
          'Content-Type': 'application/json',
          'Elasticsuite-Language': 'en',
        },
        body: JSON.stringify({
          query: testQuery,
        }),
        method: 'POST',
      })
    })
  })
})
