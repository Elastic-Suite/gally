import { useContext, useMemo } from 'react'

import { contentTypeHeader } from '~/constants'
import { schemaContext } from '~/contexts'
import { getApiUrl, getResource } from '~/services'
import {
  IFetchError,
  IHydraMember,
  IResource,
  IResourceOperations,
  Method,
} from '~/types'

import { useApiFetch } from './useApi'

export function useResource(resourceName: string): IResource {
  const api = useContext(schemaContext)
  return useMemo(() => getResource(api, resourceName), [api, resourceName])
}

export function useResourceOperations<T extends IHydraMember>(
  resource: IResource
): IResourceOperations<T> {
  const { supportedOperation } = resource
  const fetchApi = useApiFetch<T>()
  const apiUrl = getApiUrl(resource.url)

  return supportedOperation.reduce<IResourceOperations<T>>((acc, operation) => {
    if (
      typeof operation['@type'] === 'string' &&
      operation.method === Method.PATCH
    ) {
      acc.update = (
        id: string | number,
        item: Partial<T>
      ): Promise<T | IFetchError> =>
        fetchApi(`${apiUrl}/${id}`, undefined, {
          body: JSON.stringify(item),
          method: operation.method,
          headers: { [contentTypeHeader]: 'application/merge-patch+json' },
        })
    } else if (
      operation['@type'] instanceof Array &&
      operation['@type'].length === 2
    ) {
      if (operation['@type'][1] === 'http://schema.org/CreateAction') {
        acc.create = (
          item: Omit<T, 'id' | '@id' | '@type'>
        ): Promise<T | IFetchError> =>
          fetchApi(resource, undefined, {
            body: JSON.stringify(item),
            method: operation.method,
          })
      } else if (operation['@type'][1] === 'http://schema.org/ReplaceAction') {
        acc.replace = (
          item: Omit<T, '@id' | '@type'>
        ): Promise<T | IFetchError> =>
          fetchApi(`${apiUrl}/${item.id}`, undefined, {
            body: JSON.stringify(item),
            method: operation.method,
          })
      } else if (operation['@type'][1] === 'http://schema.org/DeleteAction') {
        acc.delete = (id: string | number): Promise<T | IFetchError> =>
          fetchApi(`${apiUrl}/${id}`, undefined, {
            method: operation.method,
          })
      }
    }
    return acc
  }, {})
}
