import { apiUrl } from '~/constants'
import { IResource, ISearchParameters } from '~/types'

import { getUrl } from './url'

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

export async function fetchJson<T>(
  url: RequestInfo | URL,
  options: RequestInit = {}
): Promise<{ json: T; response: Response }> {
  const response = await fetch(url, options)
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
      'Accept-Language': language,
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
