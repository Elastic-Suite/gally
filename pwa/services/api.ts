export function fetchApi(
  language: string,
  url: RequestInfo | URL,
  options: RequestInit = {}
) {
  if (process.env.NEXT_PUBLIC_LOCAL) {
    if (!String(url).startsWith('/')) {
      url = `/${url}`
    }
    if (!String(url).endsWith('.json') && !String(url).endsWith('.jsonld')) {
      url = `${url}.json`
    }
    url = `/mocks${url}`
  }
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Accept-Language': language,
    },
  }).then((response) => response.json())
}
