import { ReactNode } from 'react'

import SchemaProvider from '../SchemaProvider/SchemaProvider'

interface IProps {
  children: ReactNode
}

function AppProvider(props: IProps): JSX.Element {
  const { children } = props

  return <SchemaProvider>{children}</SchemaProvider>
}

export default AppProvider
