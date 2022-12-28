import { useEffect } from 'react'
import {
  IExtraBundle,
  IExtraConfiguration,
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
  const [bundles] = useFetchApi<IHydraResponse<IExtraBundle>>(
    'extra_bundles',
    undefined,
    undefined,
    false
  )
  const [configurations] = useFetchApi<IHydraResponse<IExtraConfiguration>>(
    'configurations',
    undefined,
    undefined,
    false
  )

  useEffect(() => {
    if (api.status === LoadStatus.FAILED) {
      log(api.error)
    }
    if (bundles.status === LoadStatus.FAILED) {
      log(bundles.error)
    }
    if (configurations.status === LoadStatus.FAILED) {
      log(configurations.error)
    }
    if (api.data && bundles.data && configurations.data) {
      dispatch(
        setData({
          api: api.data,
          bundles: bundles.data['hydra:member'].map((bundle) => bundle.name),
          configurations: configurations.data['hydra:member'].map(
            (configuration) => configuration.value
          ),
        })
      )
    }
  }, [api, bundles, configurations, dispatch, log])
}
