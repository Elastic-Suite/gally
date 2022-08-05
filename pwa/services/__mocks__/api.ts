import docs from '~/public/mocks/docs.json'
import entrypoint from '~/public/mocks/index.json'
import graphql from '~/public/mocks/graphql.json'
import metadata from '~/public/mocks/metadata.json'
import { IResource, ISearchParameters } from '~/types'

export const getApiUrl = jest.fn((url: string): string => url)

const body = { hello: 'world' }

export const fetchJson = jest.fn((url: string): Promise<unknown> => {
  switch (url) {
    case 'http://localhost/':
      return Promise.resolve({
        json: entrypoint,
        response: {
          headers: new Headers({
            Link: '<http://localhost/docs.jsonld>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"',
          }),
        },
      })
    case 'http://localhost/docs.jsonld':
      return Promise.resolve({
        json: docs,
      })
    case 'http://localhost/graphql':
      return Promise.resolve({
        json: graphql,
      })
    default:
      return Promise.resolve({
        json: body,
        response: { headers: new Headers() },
      })
  }
})

export const fetchApi = jest.fn(
  (_: string, resource: IResource | string): Promise<unknown> => {
    let data: unknown = { ...body }
    if (
      (typeof resource !== 'string' &&
        resource.title.toLowerCase() === 'metadata') ||
      (typeof resource === 'string' && resource.endsWith('metadata'))
    ) {
      data = { ...metadata }
    }
    return Promise.resolve(data)
  }
)

export const removeEmptyParameters = jest.fn(
  (searchParameters: ISearchParameters = {}): ISearchParameters =>
    searchParameters
)
