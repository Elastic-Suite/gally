import { useEffect, useState } from 'react'

import { getApiUrl, parseDocs } from '~/services'
import { IApi, IFetch, LoadStatus } from '~/types'

export function useSchemaLoader(): IFetch<IApi> {
  const [api, setApi] = useState<IFetch<IApi>>({
    status: LoadStatus.IDLE,
  })

  useEffect(() => {
    if (api.status === LoadStatus.IDLE) {
      setApi({ status: LoadStatus.LOADING })
      parseDocs(getApiUrl())
        .then((api) => setApi({ status: LoadStatus.SUCCEEDED, data: api }))
        .catch((error) => setApi({ error, status: LoadStatus.FAILED }))
    }
  }, [api.status])

  return api
}
