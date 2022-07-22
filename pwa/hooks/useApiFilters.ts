import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { getApiJsonldClass, getFilters } from '~/services'
import { IFilter, IHydraMember, IHydraResponse } from '~/types'
import { selectDocs, useAppSelector } from '~/store'

export function useApiFilters<T extends IHydraMember>(
  api: string,
  apiData: IHydraResponse<T>
): IFilter[] {
  const { t } = useTranslation('api')
  const docs = useAppSelector(selectDocs)
  return useMemo(() => {
    const hydraClass = getApiJsonldClass(docs, api, 'get')
    return getFilters(docs, apiData, hydraClass, t) ?? []
  }, [api, apiData, docs, t])
}
