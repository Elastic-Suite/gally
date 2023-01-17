import { useContext, useMemo } from 'react'
import {
  IResource,
  getResource,
  schemaContext,
} from '@elastic-suite/gally-admin-shared'

export function useResource(resourceName: string): IResource {
  const api = useContext(schemaContext)

  return useMemo(() => {
    return getResource(api, resourceName)
  }, [api, resourceName])
}
