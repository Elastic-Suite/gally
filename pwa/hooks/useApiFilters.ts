import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { getFilter, getMappings } from '~/services'
import { IFilter, IHydraMember, IHydraResponse, IResource } from '~/types'

export function useApiFilters<A extends IHydraMember>(
  apiData: IHydraResponse<A>,
  resource: IResource
): IFilter[] {
  const { t } = useTranslation('api')
  const mappings = useMemo(
    () => getMappings(apiData, resource),
    [apiData, resource]
  )

  return useMemo(
    () => mappings.map((mapping) => getFilter(mapping, t)),
    [mappings, t]
  )
}
