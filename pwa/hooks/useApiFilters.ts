import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'

import { schemaContext } from '~/contexts'
import {
  getFilter,
  getMappings,
  getOptionsFromApi,
  getReferencedResource,
  isFetchError,
  isReferenceField,
} from '~/services'
import {
  IFetch,
  IFetchError,
  IField,
  IFilter,
  IHydraMember,
  IHydraResponse,
  IResource,
  LoadStatus,
} from '~/types'

import { useApiFetch } from './useApi'

export function useApiFilters<A extends IHydraMember, R extends IHydraMember>(
  apiData: IHydraResponse<A>,
  resource: IResource
): IFilter[] {
  const api = useContext(schemaContext)
  const [references, setReferences] = useState<
    IFetch<Map<IField, IHydraResponse<R> | IFetchError>>
  >({
    status: LoadStatus.IDLE,
  })

  const { t } = useTranslation('api')
  const fetchApi = useApiFetch<IHydraResponse<R>>()
  const mappings = useMemo(
    () => getMappings(apiData, resource),
    [apiData, resource]
  )

  useEffect(() => {
    setReferences({ status: LoadStatus.LOADING })
    const promises = mappings
      .filter((mapping) => mapping.multiple && isReferenceField(mapping.field))
      .map((mapping) =>
        fetchApi(getReferencedResource(api, mapping.field)?.url).then(
          (json) => [mapping.field, json]
        )
      )

    Promise.all(promises).then((results: [IField, IHydraResponse<R>][]) =>
      setReferences({
        data: new Map(results),
        status: LoadStatus.SUCCEEDED,
      })
    )
  }, [api, fetchApi, mappings])

  return useMemo(
    () =>
      mappings
        .map((mapping) => {
          const response = references.data?.get(mapping.field)
          return {
            ...mapping,
            options:
              (response &&
                !isFetchError(response) &&
                getOptionsFromApi(response)) ??
              [],
          }
        })
        .map((mapping) => getFilter(mapping, t)),
    [mappings, references.data, t]
  )
}
