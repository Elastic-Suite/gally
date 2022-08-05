import { apiUrl } from '~/constants'
import { IResource, ISearchParameters } from '~/types'

import { getUrl } from './url'

export function normalizeUrl(url = ''): string {
  if (process.env.NEXT_PUBLIC_LOCAL) {
    try {
      const urlObj = new URL(url)
      if (urlObj.origin === apiUrl) {
        if (urlObj.pathname === '/') {
          urlObj.pathname = '/index'
        }
        if (
          urlObj.pathname &&
          !urlObj.pathname.endsWith('.json') &&
          !urlObj.pathname.endsWith('.jsonld')
        ) {
          urlObj.pathname = `${urlObj.pathname}.json`
        }
        if (urlObj.pathname.endsWith('.jsonld')) {
          urlObj.pathname = `${urlObj.pathname.slice(0, -7)}.json`
        }
        if (!urlObj.pathname.startsWith('/mocks')) {
          urlObj.pathname = `/mocks${urlObj.pathname}`
        }
        url = urlObj.href
      }
    } catch (error) {
      // in that case just silent and don't transform the URL
    }
  }
  return url
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

export async function fetchJson<T>(
  url: RequestInfo | URL,
  options: RequestInit = {}
): Promise<{ json: T; response: Response }> {
  const response = await fetch(normalizeUrl(url.toString()), options)
  const json = await response.json()
  return { json, response }
}

export async function fetchApi<T>(
  language: string,
  resource: IResource | string,
  searchParameters: ISearchParameters = {},
  options: RequestInit = {}
): Promise<T> {
  const apiUrl =
    typeof resource === 'string' ? getApiUrl(resource) : getApiUrl(resource.url)
  const { json } = await fetchJson<T>(getUrl(apiUrl, searchParameters), {
    ...options,
    headers: {
      ...options.headers,
      'Elasticsuite-Language': language,
    },
  })
  return json
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
