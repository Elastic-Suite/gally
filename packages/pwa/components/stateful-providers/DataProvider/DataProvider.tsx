import { ReactChild } from 'react'

import SchemaProvider from '~/components/stateful-providers/SchemaProvider/SchemaProvider'
import UserProvider from '~/components/stateful-providers/UserProvider/UserProvider'

interface IProps {
  children: ReactChild
}

function DataProvider(props: IProps): JSX.Element {
  const { children } = props

  return (
    <UserProvider>
      <SchemaProvider>{children}</SchemaProvider>
    </UserProvider>
  )
}

export default DataProvider
