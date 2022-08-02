import { useContext, useMemo } from 'react'

import { schemaContext } from '~/contexts'
import { getResource } from '~/services'
import { IResource } from '~/types'

export function useResource(resourceName: string): IResource {
  const api = useContext(schemaContext)
  return useMemo(() => getResource(api, resourceName), [api, resourceName])
}
