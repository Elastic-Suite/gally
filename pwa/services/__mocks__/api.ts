import { Resource } from '@api-platform/api-doc-parser'

import metadata from '~/public/mocks/metadata.json'
import { ISearchParameters } from '~/types'

export const getApiUrl = jest.fn((url: string): string => url)

export const fetchApi = jest.fn(
  (_: string, resource: Resource | string): Promise<unknown> => {
    let data: unknown = { hello: 'world' }
    if (typeof resource !== 'string' && resource.title === 'Metadata') {
      data = metadata
    }
    return Promise.resolve(data)
  }
)

export const removeEmptyParameters = jest.fn(
  (searchParameters: ISearchParameters = {}): ISearchParameters =>
    searchParameters
)
