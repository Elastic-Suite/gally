import { ReactNode } from 'react'

import SchemaProvider from '~/components/stateful-providers/SchemaProvider/SchemaProvider'
import UserProvider from '~/components/stateful-providers/UserProvider/UserProvider'

interface IProps {
  children: ReactNode
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
