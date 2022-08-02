import metadata from '~/public/mocks/metadata.json'
import { IResource, ISearchParameters } from '~/types'

export const getApiUrl = jest.fn((url: string): string => url)

const body = { hello: 'world' }

export const fetchJson = jest.fn(
  (): Promise<unknown> =>
    Promise.resolve({
      json: body,
      response: new Response(JSON.stringify(body)),
    })
)

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
