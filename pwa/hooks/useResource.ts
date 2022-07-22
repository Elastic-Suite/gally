import { useMemo } from 'react'
import { Resource } from '@api-platform/api-doc-parser'

import { getResource } from '~/services'
import { selectDoc, useAppSelector } from '~/store'

export function useResource(resourceName: string): Resource {
  const doc = useAppSelector(selectDoc)
  return useMemo(() => getResource(doc.data, resourceName), [doc, resourceName])
}
