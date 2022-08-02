import { ReactChild } from 'react'

import AppProvider from '~/components/AppProvider'
import { AppStore } from '~/store'
import { useSchemaLoader } from '~/hooks/useSchemaLoader'

interface IProps {
  children: ReactChild
  store: AppStore
}

function SchemaLoader(props: IProps): JSX.Element {
  const { children, store } = props
  const api = useSchemaLoader()

  if (api.error) {
    // eslint-disable-next-line no-console
    console.error(api.error)
    return <pre>{JSON.stringify(api.error, null, 2)}</pre>
  } else if (!api.data) {
    return null
  }

  return (
    <AppProvider api={api.data} store={store}>
      {children}
    </AppProvider>
  )
}

export default SchemaLoader
