import { Resource } from '@api-platform/api-doc-parser'

import { apiUrl } from '~/constants'

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

export function fetchApi<T>(
  language: string,
  resource: Resource | string,
  options: RequestInit = {}
): Promise<T> {
  const url =
    typeof resource === 'string' ? getApiUrl(resource) : getApiUrl(resource.url)
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Accept-Language': language,
    },
  }).then((response) => response.json())
}
