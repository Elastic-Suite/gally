import {
  apiUrl,
  authErrorCodes,
  authHeader,
  contentTypeHeader,
  languageHeader,
  tokenStorageKey,
} from '../constants'
import { IResource, IResponseError, ISearchParameters } from '../types'

import { fetchJson } from './fetch'
import { HydraError, getFieldName, isHydraError, isJSonldType } from './hydra'
import { AuthError } from './network'
import { storageGet, storageRemove } from './storage'
import { getUrl } from './url'

export class ApiError extends Error {}

export function isApiError<T>(
  json: T | IResponseError
): json is IResponseError {
  return 'code' in json && 'message' in json
}

export function getApiUrl(url = ''): string {
  if (!url.startsWith('http')) {
    if (!url.startsWith('/')) {
      url = `/${url}`
    }
    url = `${apiUrl}${url}`
  }
  return url
}

export function fetchApi<T>(
  language: string,
  resource: IResource | string,
  searchParameters: ISearchParameters = {},
  options: RequestInit = {},
  secure = true
): Promise<T> {
  const apiUrl =
    typeof resource === 'string' ? getApiUrl(resource) : getApiUrl(resource.url)
  const headers: Record<string, string> = {
    [languageHeader]: language,
    [contentTypeHeader]: 'application/ld+json',
    ...(options.headers as Record<string, string>),
  }
  const token = storageGet(tokenStorageKey)
  if (secure && token) {
    headers[authHeader] = `Bearer ${token}`
  }
  return fetchJson<T>(getUrl(apiUrl, searchParameters).href, {
    ...options,
    headers,
  }).then(({ json, response }) => {
    if (isApiError(json)) {
      if (authErrorCodes.includes(json.code)) {
        storageRemove(tokenStorageKey)
      }
      throw new ApiError(json.message)
    } else if (isJSonldType(json) && isHydraError(json)) {
      throw new HydraError(json)
    } else if (authErrorCodes.includes(response.status)) {
      // fixme: should we redirect to login if 401/403 error ?
      storageRemove(tokenStorageKey)
      throw new AuthError('Unauthorized/Forbidden')
    }
    return json
  })
}

export function removeEmptyParameters(
  searchParameters: ISearchParameters = {}
): ISearchParameters {
  return Object.fromEntries(
    Object.entries(searchParameters).filter(
      ([_, value]) => (value ?? '') !== ''
    )
  )
}

export function getApiFilters(
  filters: ISearchParameters = {}
): ISearchParameters {
  return Object.fromEntries(
    Object.entries(filters).reduce<
      [string, string | number | boolean | (string | number | boolean)[]][]
    >((acc, [key, value]) => {
      if (key.endsWith('[between]')) {
        const baseKey = getFieldName(key)
        value = value as (string | number)[]
        if (value[0] !== '') {
          acc.push([`${baseKey}[gte]`, value[0]])
        }
        if (value[1] !== '') {
          acc.push([`${baseKey}[lte]`, value[1]])
        }
      } else {
        acc.push([key, value])
      }
      return acc
    }, [])
  )
}
