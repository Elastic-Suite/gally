import { useEffect, useState } from 'react'
import { Api, parseHydraDocumentation } from '@api-platform/api-doc-parser'

import { getApiUrl } from '~/services'
import { IFetch, LoadStatus } from '~/types'

export function useDocLoader(): IFetch<Api> {
  const [api, setApi] = useState<IFetch<Api>>({
    status: LoadStatus.IDLE,
  })

  useEffect(() => {
    if (api.status === LoadStatus.IDLE) {
      setApi({ status: LoadStatus.LOADING })
      parseHydraDocumentation(getApiUrl())
        .then(({ api }) => setApi({ status: LoadStatus.SUCCEEDED, data: api }))
        .catch((error) => setApi({ error, status: LoadStatus.FAILED }))
    }
  }, [api.status])

  return api
}
