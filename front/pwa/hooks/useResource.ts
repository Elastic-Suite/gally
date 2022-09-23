import { useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'

import {
  IError,
  IHydraMember,
  IResource,
  IResourceOperations,
  Method,
  contentTypeHeader,
  getApiUrl,
  getResource,
  schemaContext,
  updatePropertiesAccordingToPath,
} from 'shared'

import { useApiFetch } from './useApi'

export function useResource(resourceName: string): IResource {
  const api = useContext(schemaContext)
  const { pathname } = useRouter()

  return useMemo(() => {
    const resource = getResource(api, resourceName)
    return {
      ...resource,
      supportedProperty: resource?.supportedProperty.map((field) =>
        updatePropertiesAccordingToPath(field, pathname)
      ),
    }
  }, [api, pathname, resourceName])
}

export function useResourceOperations<T extends IHydraMember>(
  resource: IResource
): IResourceOperations<T> {
  const { supportedOperation } = resource
  const fetchApi = useApiFetch<T>()
  const apiUrl = getApiUrl(resource.url)

  const update = useCallback(
    (id: string | number, item: Partial<T>): Promise<T | IError> =>
      fetchApi(`${apiUrl}/${id}`, undefined, {
        body: JSON.stringify(item),
        method: Method.PATCH,
        headers: { [contentTypeHeader]: 'application/merge-patch+json' },
      }),
    [apiUrl, fetchApi]
  )

  const create = useCallback(
    (item: Omit<T, 'id' | '@id' | '@type'>): Promise<T | IError> =>
      fetchApi(apiUrl, undefined, {
        body: JSON.stringify(item),
        method: Method.POST,
      }),
    [apiUrl, fetchApi]
  )

  const replace = useCallback(
    (item: Omit<T, '@id' | '@type'>): Promise<T | IError> =>
      fetchApi(`${apiUrl}/${item.id}`, undefined, {
        body: JSON.stringify(item),
        method: Method.PUT,
      }),
    [apiUrl, fetchApi]
  )

  const remove = useCallback(
    (id: string | number): Promise<T | IError> =>
      fetchApi(`${apiUrl}/${id}`, undefined, {
        method: Method.DELETE,
      }),
    [apiUrl, fetchApi]
  )

  return useMemo(
    () =>
      supportedOperation.reduce<IResourceOperations<T>>((acc, operation) => {
        if (
          typeof operation['@type'] === 'string' &&
          operation.method === Method.PATCH
        ) {
          acc.update = update
        } else if (
          operation['@type'] instanceof Array &&
          operation['@type'].length === 2
        ) {
          if (operation['@type'][1] === 'http://schema.org/CreateAction') {
            acc.create = create
          } else if (
            operation['@type'][1] === 'http://schema.org/ReplaceAction'
          ) {
            acc.replace = replace
          } else if (
            operation['@type'][1] === 'http://schema.org/DeleteAction'
          ) {
            acc.remove = remove
          }
        }
        return acc
      }, {}),
    [create, remove, replace, supportedOperation, update]
  )
}
