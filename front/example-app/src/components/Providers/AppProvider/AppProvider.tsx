import { ReactNode } from 'react'

import CatalogProvider from '../CatalogProvider/CatalogProvider'
import CategoryProvider from '../CategoryProvider/CategoryProvider'
import RequestedPathProvider from '../RequestedPathProvider/RequestedPathProvider'
import SchemaProvider from '../SchemaProvider/SchemaProvider'
import SearchProvider from '../SearchProvider/SearchProvider'
import UserProvider from '../UserProvider/UserProvider'

interface IProps {
  children: ReactNode
}

function AppProvider(props: IProps): JSX.Element {
  const { children } = props
  return (
    <UserProvider>
      <SchemaProvider>
        <CatalogProvider>
          <RequestedPathProvider>
            <CategoryProvider>
              <SearchProvider>{children}</SearchProvider>
            </CategoryProvider>
          </RequestedPathProvider>
        </CatalogProvider>
      </SchemaProvider>
    </UserProvider>
  )
}

export default AppProvider
