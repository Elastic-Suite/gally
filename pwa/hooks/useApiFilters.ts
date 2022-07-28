import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Field, Resource } from '@api-platform/api-doc-parser'

import { fetchApi, getFilter, getMappings, getOptionsFromApi } from '~/services'
import {
  IFetch,
  IFilter,
  IHydraMember,
  IHydraResponse,
  LoadStatus,
} from '~/types'

export function useApiFilters<A extends IHydraMember, R extends IHydraMember>(
  apiData: IHydraResponse<A>,
  resource: Resource
): IFilter[] {
  const [references, setReferences] = useState<
    IFetch<Map<Field, IHydraResponse<R>>>
  >({
    status: LoadStatus.IDLE,
  })
  const { i18n, t } = useTranslation('api')
  const mappings = useMemo(
    () => getMappings(apiData, resource),
    [apiData, resource]
  )

  useEffect(() => {
    setReferences({ status: LoadStatus.LOADING })
    const promises = mappings
      .filter((mapping) => mapping.multiple && mapping.field.reference)
      .map((mapping) =>
        fetchApi<IHydraResponse<R>>(
          i18n.language,
          mapping.field.reference
        ).then((json) => [mapping.field, json])
      )

    Promise.all(promises)
      .then((responses: [Field, IHydraResponse<R>][]) =>
        setReferences({
          data: new Map(responses),
          status: LoadStatus.SUCCEEDED,
        })
      )
      .catch((error) => setReferences({ error, status: LoadStatus.FAILED }))
  }, [i18n.language, mappings])

  return useMemo(
    () =>
      mappings
        .map((mapping) => {
          const response = references.data?.get(mapping.field)
          return {
            ...mapping,
            options: (response && getOptionsFromApi(response)) ?? [],
          }
        })
        .map((mapping) => getFilter(mapping, t)),
    [mappings, references.data, t]
  )
}
