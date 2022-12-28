import {
  authErrorCodes,
  authHeader,
  contentTypeHeader,
  gqlUrl,
  languageHeader,
  tokenStorageKey,
} from '../constants'
import { IGraphql, IGraphqlError } from '../types'

import { fetchJson } from './fetch'
import { AuthError } from './network'
import { storageGet, storageRemove } from './storage'

export class GraphqlError extends Error {
  errors: IGraphqlError[]
  constructor(errors: IGraphqlError[]) {
    super(errors[0].message)
    this.errors = errors
  }
}

export function isGraphqlError<T>(
  json: T | IGraphqlError[]
): json is IGraphqlError[] {
  return 'errors' in json
}

export function fetchGraphql<T>(
  language: string,
  query: string,
  variables?: Record<string, unknown>,
  options: RequestInit = {},
  secure = true
): Promise<T> {
  const headers: Record<string, string> = {
    [languageHeader]: language,
    [contentTypeHeader]: 'application/json',
    ...(options.headers as Record<string, string>),
  }
  const token = storageGet(tokenStorageKey)
  if (secure && token) {
    headers[authHeader] = `Bearer ${token}`
  }
  return fetchJson<IGraphql<T>>(gqlUrl, {
    body: JSON.stringify({
      query,
      variables,
    }),
    method: 'POST',
    ...options,
    headers,
  }).then(({ json, response }) => {
    if (isGraphqlError(json)) {
      throw new GraphqlError(json.errors)
    } else if (authErrorCodes.includes(response.status)) {
      storageRemove(tokenStorageKey)
      throw new AuthError('Unauthorized/Forbidden')
    }
    return json.data
  })
}
