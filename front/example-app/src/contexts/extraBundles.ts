import { createContext } from 'react'
import { Bundle } from '@elastic-suite/gally-admin-shared'

interface IExtraBundlesContext {
  extraBundles: Bundle[]
  isExtraBundleAvailable: (bundle: Bundle) => boolean
}

export const extraBundlesContext = createContext<
  IExtraBundlesContext | undefined
>({
  extraBundles: [],
  isExtraBundleAvailable: () => false,
})
