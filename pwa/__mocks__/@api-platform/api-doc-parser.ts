import { Api } from '@api-platform/api-doc-parser'

import { api } from '~/mocks'

export function parseHydraDocumentation(): Promise<{ api: Api }> {
  return Promise.resolve({ api })
}
