import { api } from 'shared/src/mocks'

import categorySortingOptions from '~/public/mocks/category_sorting_options.json'
import docs from '~/public/mocks/docs.json'
import entrypoint from '~/public/mocks/index.json'
import graphql from '~/public/mocks/graphql.json'
import metadata from '~/public/mocks/metadata.json'
import sourceFieldOptionLabels from '~/public/mocks/source_field_option_labels.json'

export * from 'shared/src/constants'
export * from 'shared/src/mocks'
export * from 'shared/src/services/breadcrumb'
export * from 'shared/src/services/catalog'
export * from 'shared/src/services/field'
export * from 'shared/src/services/format'
export * from 'shared/src/services/hydra'
export * from 'shared/src/services/local'
export * from 'shared/src/services/options'
export * from 'shared/src/services/rules'
export * from 'shared/src/services/style'
export * from 'shared/src/services/table'
export * from 'shared/src/services/url'
export * from 'shared/src/services/user'
export * from 'shared/src/types'

const body = { hello: 'world' }

/* api */
export const getApiUrl = jest.fn((url) => url)

export const fetchApi = jest.fn(
  (_, resource) => {
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
  (searchParameters = {}) =>
    searchParameters
)

export const log = jest.fn((log, error) => log(error.message))

/* fetch */
export const isFetchError = jest.fn((json) => 'error' in json)
export const fetchJson = jest.fn((url) => {
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

/* parser */
export const parseSchema = jest.fn(() => Promise.resolve(api))

/* storage */
export const storageGet = jest.fn()
export const storageSet = jest.fn()
export const storageRemove = jest.fn()
