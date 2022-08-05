import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { getFieldHeader } from '~/services'
import { IResource, ITableHeader } from '~/types'

export function useApiHeaders(resource: IResource): ITableHeader[] {
  const { t } = useTranslation('api')
  return useMemo(() => {
    return resource.supportedProperty
      .filter((field) => field.property.showable)
      .map((field) => getFieldHeader(field, t))
  }, [resource, t])
}
