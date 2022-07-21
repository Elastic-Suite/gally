import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { getApiReadableProperties, getPropertyHeader } from '~/services'
import { IFetch, ITableHeader } from '~/types'
import { IDocs } from '~/store'

export function useApiHeaders(
  docs: IFetch<IDocs>,
  api: string
): ITableHeader[] {
  const { t } = useTranslation('api')
  return useMemo(() => {
    const properties = getApiReadableProperties(docs, api, 'get')
    return properties.map((property) => getPropertyHeader(property, t))
  }, [api, docs, t])
}
