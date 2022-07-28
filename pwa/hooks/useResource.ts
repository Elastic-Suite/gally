import { useContext, useMemo } from 'react'
import { Resource } from '@api-platform/api-doc-parser'

import { resourcesContext } from '~/contexts'
import { getResource } from '~/services'

export function useResource(resourceName: string): Resource {
  const api = useContext(resourcesContext)
  return useMemo(() => getResource(api, resourceName), [api, resourceName])
}
