import categorySortingOptions from '../../mocks/static/category_sorting_options.json'
import metadata from '../../mocks/static/metadata.json'
import sourceFieldOptionLabels from '../../mocks/static/source_field_option_labels.json'
import { IResource, ISearchParameters } from '../../types'

export const getApiUrl = jest.fn((url: string): string => url)

const body = { hello: 'world' }

export const fetchApi = jest.fn(
  (_: string, resource: IResource | string): Promise<unknown> => {
    let data: unknown = { ...body }
    if (
      (typeof resource !== 'string' &&
        resource.title.toLowerCase() === 'metadata') ||
      (typeof resource === 'string' && resource.endsWith('metadata'))
    ) {
      data = { ...metadata }
    } else if (
      typeof resource === 'string' &&
      resource.endsWith('category_sorting_options')
    ) {
      data = { ...categorySortingOptions }
    } else if (
      (typeof resource !== 'string' &&
        resource.title.toLowerCase() === 'source_field_option_label') ||
      (typeof resource === 'string' &&
        resource.endsWith('source_field_option_labels'))
    ) {
      data = { ...sourceFieldOptionLabels }
    }
    return Promise.resolve(data)
  }
)

export const removeEmptyParameters = jest.fn(
  (searchParameters: ISearchParameters = {}): ISearchParameters =>
    searchParameters
)

export const log = jest.fn((log, error) => log(error.message))
