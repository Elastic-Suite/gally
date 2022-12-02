import { useDataLoader, useUser } from '~/hooks'
import { selectApi, selectBundles, useAppSelector } from '~/store'

interface IProps {
  children: JSX.Element
}

function DataProvider(props: IProps): JSX.Element {
  const { children } = props
  const api = useAppSelector(selectApi)
  const bundles = useAppSelector(selectBundles)

  // Load user in the store
  useUser()

  // Load data in the store
  useDataLoader()

  if (!api || !bundles) {
    return null
  }

  return children
}

export default DataProvider
