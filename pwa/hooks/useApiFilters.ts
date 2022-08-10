import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'

import { schemaContext } from '~/contexts'
import {
  fetchApi,
  getFilter,
  getMappings,
  getOptionsFromApi,
  getReferencedResource,
  isReferenceField,
} from '~/services'
import {
  IFetch,
  IField,
  IFilter,
  IHydraMember,
  IHydraResponse,
  IResource,
  LoadStatus,
} from '~/types'

export function useApiFilters<A extends IHydraMember, R extends IHydraMember>(
  apiData: IHydraResponse<A>,
  resource: IResource
): IFilter[] {
  const api = useContext(schemaContext)
  const [references, setReferences] = useState<
    IFetch<Map<IField, IHydraResponse<R>>>
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
      .filter((mapping) => mapping.multiple && isReferenceField(mapping.field))
      .map((mapping) =>
        fetchApi<IHydraResponse<R>>(
          i18n.language,
          getReferencedResource(api, mapping.field)?.url
        ).then((json) => [mapping.field, json])
      )

    Promise.all(promises)
      .then((results: [IField, IHydraResponse<R>][]) =>
        setReferences({
          data: new Map(results),
          status: LoadStatus.SUCCEEDED,
        })
      )
      .catch((error) => setReferences({ error, status: LoadStatus.FAILED }))
  }, [api, i18n.language, mappings])

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
