import { Resource } from '@api-platform/api-doc-parser'

import metadata from '~/public/mocks/metadata.json'

export function getApiUrl(url: string): string {
  return url
}

export function fetchApi(
  _: string,
  resource: Resource | string
): Promise<unknown> {
  let data: unknown = { hello: 'world' }
  if (typeof resource !== 'string' && resource.title === 'Metadata') {
    data = metadata
  }
  return Promise.resolve(data)
}
