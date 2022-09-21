/* eslint-disable max-classes-per-file */
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
import { storageGet, storageRemove } from './storage'
import { getUrl } from './url'

export class ApiError extends Error {}

export class AuthError extends Error {}

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
    [contentTypeHeader]: 'application/json',
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
    // fixme: should we redirect to login if 401/403 error ?
    if (isApiError(json)) {
      storageRemove(tokenStorageKey)
      throw new ApiError(json.message)
    } else if (authErrorCodes.includes(response.status)) {
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

export type NetworkError = Error | ApiError | AuthError
export function log(log: (message: string) => void, error: NetworkError): void {
  if (
    process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' && window.showErrors === true)
  ) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
  log(error.message)
}
