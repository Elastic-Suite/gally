import { useEffect, useState } from 'react'

import { getApiUrl, parseSchema } from '~/services'
import { IApi, IFetch, LoadStatus } from '~/types'

import { useLog } from './useLog'

export function useSchemaLoader(): IFetch<IApi> {
  const log = useLog()
  const [api, setApi] = useState<IFetch<IApi>>({
    status: LoadStatus.IDLE,
  })

  useEffect(() => {
    if (api.status === LoadStatus.IDLE) {
      setApi({ status: LoadStatus.LOADING })
      parseSchema(getApiUrl())
        .then((api) => setApi({ status: LoadStatus.SUCCEEDED, data: api }))
        .catch((error) => {
          log(error)
          setApi({ error, status: LoadStatus.FAILED })
        })
    }
  }, [api.status, log])

  return api
}
