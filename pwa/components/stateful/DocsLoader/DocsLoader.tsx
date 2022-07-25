import { ReactChild } from 'react'

import AppProvider from '~/components/AppProvider'
import { AppStore } from '~/store'
import { useDocLoader } from '~/hooks'

interface IProps {
  children: ReactChild
  store: AppStore
}

function DocsLoader(props: IProps): JSX.Element {
  const { children, store } = props
  const api = useDocLoader()

  if (api.error) {
    return <>{api.error.toString()}</>
  } else if (!api.data) {
    return null
  }

  return (
    <AppProvider api={api.data} store={store}>
      {children}
    </AppProvider>
  )
}

export default DocsLoader
