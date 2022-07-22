import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { getApiReadableProperties, getPropertyHeader } from '~/services'
import { ITableHeader } from '~/types'
import { selectDocs, useAppSelector } from '~/store'

export function useApiHeaders(api: string): ITableHeader[] {
  const { t } = useTranslation('api')
  const docs = useAppSelector(selectDocs)

  return useMemo(() => {
    const properties = getApiReadableProperties(docs, api, 'get')
    return properties.map((property) => getPropertyHeader(property, t))
  }, [api, docs, t])
}
