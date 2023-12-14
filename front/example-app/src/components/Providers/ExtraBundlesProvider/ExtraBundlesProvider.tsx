import React, { ReactNode, useCallback, useMemo } from 'react'
import {
  Bundle,
  IExtraBundle,
  IHydraResponse,
} from '@elastic-suite/gally-admin-shared'

import { extraBundlesContext } from '../../../contexts'
import { useFetchApi } from 'src/hooks'

interface IProps {
  children: ReactNode
}

export default function ExtraBundlesProvider(props: IProps): JSX.Element {
  const { children } = props

  const [fetchedExtraBundles] =
    useFetchApi<IHydraResponse<IExtraBundle>>('/extra_bundles')

  const extraBundles =
    fetchedExtraBundles?.data &&
    fetchedExtraBundles.data['hydra:member'].map(
      (extraBundle) => extraBundle.id
    )

  const isExtraBundleAvailable = useCallback(
    (extraBundle: Bundle): boolean => {
      if (!extraBundles) return false

      return extraBundles.includes(extraBundle)
    },
    [extraBundles]
  )

  const memoizedContextValue = useMemo(
    () => ({
      extraBundles,
      isExtraBundleAvailable,
    }),
    [extraBundles, isExtraBundleAvailable]
  )

  if (!extraBundles) {
    return null
  }

  return (
    <extraBundlesContext.Provider value={memoizedContextValue}>
      {children}
    </extraBundlesContext.Provider>
  )
}
