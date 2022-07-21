import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { getFilters } from '~/services'
import { IFilter, IHydraMember, IHydraResponse } from '~/types'

export function useApiFilters<T extends IHydraMember>(
  apiData: IHydraResponse<T>
): IFilter[] {
  const { t } = useTranslation('api')
  return useMemo(() => getFilters(apiData, t) ?? [], [apiData, t])
}
