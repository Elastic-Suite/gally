import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Resource } from '@api-platform/api-doc-parser'

import { getFieldHeader } from '~/services'
import { ITableHeader } from '~/types'

export function useApiHeaders(resource: Resource): ITableHeader[] {
  const { t } = useTranslation('api')
  return useMemo(() => {
    return resource.readableFields
      .filter((field) => !field.reference)
      .map((field) => getFieldHeader(field, t))
  }, [resource, t])
}
