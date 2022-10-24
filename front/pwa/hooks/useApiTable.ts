import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'

import {
  IField,
  IOptions,
  IResource,
  ITableHeader,
  getFieldHeader,
} from 'shared'

export function useApiHeaders(resource: IResource): ITableHeader[] {
  const { t } = useTranslation('api')
  return useMemo(() => {
    return resource.supportedProperty
      .filter((field) => field.elasticsuite?.visible)
      .sort((a, b) => a.elasticsuite?.position - b.elasticsuite?.position)
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
