import { useTranslation } from 'next-i18next'
import { useMemo } from 'react'

import { useRouter } from 'next/router'
import { getFieldHeader, updatePropertiesAccordingToPath } from '~/services'
import { IField, IOptions, IResource, ITableHeader } from '~/types'

export function useApiHeaders(resource: IResource): ITableHeader[] {
  const { t } = useTranslation('api')

  const router = useRouter()

  return useMemo(() => {
    return resource.supportedProperty
      .map((field) => updatePropertiesAccordingToPath(field, router.asPath))
      .filter((field) => field.elasticsuite?.visible)
      .map((field) => getFieldHeader(field, t))
  }, [resource, t, router])
}

export function useApiEditableFieldOptions(
  resource: IResource
): IOptions<IField> {
  const router = useRouter()

  return useMemo(() => {
    return resource.supportedProperty
      .map((field) => updatePropertiesAccordingToPath(field, router.asPath))
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
  }, [resource, router])
}
