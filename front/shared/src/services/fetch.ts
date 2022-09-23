import { apiUrl } from '../constants'
import { Method } from '../types'

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

export async function fetchJson<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ json: T; response: Response }> {
  if (!options.method || options.method === Method.GET) {
    url = normalizeUrl(url.toString())
  }
  const response = await fetch(url, options)
  const json = await response.json()
  return { json, response }
}
