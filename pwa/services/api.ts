import { Resource } from '@api-platform/api-doc-parser'

import { apiUrl } from '~/constants'
import { ISearchParameters } from '~/types'

export function getApiUrl(url = ''): string {
  if (process.env.NEXT_PUBLIC_LOCAL) {
    if (
      url &&
      !String(url).endsWith('.json') &&
      !String(url).endsWith('.jsonld')
    ) {
      url = `${url}.json`
    }
  }
  if (!String(url).startsWith('http')) {
    if (!String(url).startsWith('/')) {
      url = `/${url}`
    }
    if (process.env.NEXT_PUBLIC_LOCAL) {
      if (!String(url).startsWith('/mocks')) {
        url = `/mocks${url}`
      }
    }
    url = `${apiUrl}${url}`
  }
  return url
}

export function getUrl(
  resource: Resource | string,
  searchParameters: ISearchParameters = {}
): URL {
  const stringUrl =
    typeof resource === 'string' ? getApiUrl(resource) : getApiUrl(resource.url)
  const url = new URL(stringUrl)

  Object.entries(searchParameters).forEach(([key, value]) => {
    if (value instanceof Array) {
      value.forEach((value) => url.searchParams.append(key, String(value)))
    } else {
      url.searchParams.append(key, String(value))
    }
  })

  return url
}

export function fetchApi<T>(
  language: string,
  resource: Resource | string,
  searchParameters: ISearchParameters = {},
  options: RequestInit = {}
): Promise<T> {
  return fetch(getUrl(resource, searchParameters), {
    ...options,
    headers: {
      ...options.headers,
      'Accept-Language': language,
    },
  }).then((response) => response.json())
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
