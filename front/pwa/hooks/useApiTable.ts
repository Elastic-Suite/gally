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
      .filter((field) => field.elasticsuite?.visible ?? true)
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
          (field.elasticsuite?.visible ?? true) &&
          (field.elasticsuite?.editable ?? true) &&
          field.writeable
      )
      .map((field) => ({
        id: field.title,
        label: field.property.label,
        value: field,
      }))
  }, [resource])
}
