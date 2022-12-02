import { useEffect } from 'react'
import {
  IExtraBundle,
  IHydraResponse,
  LoadStatus,
  useSchemaLoader,
} from 'shared'

import { setData, useAppDispatch } from '~/store'

import { useFetchApi } from './useApi'
import { useLog } from './useLog'

export function useDataLoader(): void {
  const dispatch = useAppDispatch()
  const log = useLog()
  const api = useSchemaLoader()
  const [bundles] = useFetchApi<IHydraResponse<IExtraBundle>>('extra_bundles')

  useEffect(() => {
    if (api.status === LoadStatus.FAILED) {
      log(api.error)
    } else if (bundles.status === LoadStatus.FAILED) {
      log(bundles.error)
    } else if (api.data && bundles.data) {
      dispatch(setData({ api: api.data, bundles: bundles.data }))
    }
  }, [api, bundles, dispatch, log])
}
