import { ReactNode } from 'react'

import SchemaProvider from '../SchemaProvider/SchemaProvider'
import CatalogProvider from '../CatalogProvider/CatalogProvider'

interface IProps {
  children: ReactNode
}

function AppProvider(props: IProps): JSX.Element {
  const { children } = props
  return (
    <SchemaProvider>
      <CatalogProvider>{children}</CatalogProvider>
    </SchemaProvider>
  )
}

export default AppProvider
