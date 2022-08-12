import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { getFieldHeader } from '~/services'
import { IField, IOptions, IResource, ITableHeader } from '~/types'

export function useApiHeaders(resource: IResource): ITableHeader[] {
  const { t } = useTranslation('api')
  return useMemo(() => {
    return resource.supportedProperty
      .filter((field) => field.elasticsuite?.visible)
      .map((field) => getFieldHeader(field, t))
  }, [resource, t])
}

export function useApiEditableFieldOptions(
  resource: IResource
): IOptions<IField> {
  return useMemo(() => {
    return resource.supportedProperty
      .filter(
        (field) =>
          field.elasticsuite?.visible &&
          field.elasticsuite?.editable &&
          field.writeable
      )
      .map((field) => ({
        id: field.title,
        label: field.property.label,
        value: field,
      }))
  }, [resource])
}
