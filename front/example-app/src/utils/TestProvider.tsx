import { ReactNode, useMemo } from 'react'
import { IApi, IUser, schemaContext } from 'gally-admin-shared'

import {
  ICatalogContext,
  catalogContext,
  categoryContext,
  userContext,
} from '../contexts'
import { catalogsGraphql, categoriesGraphql } from '../mocks'

import RequestedPathProvider from '../components/Providers/RequestedPathProvider/RequestedPathProvider'

interface IProps {
  api: IApi
  children: ReactNode
}

const timestamp = Math.floor(Date.now() / 1000)
const expires = 8 * 60 * 60 // 8 hours

const user = {
  iat: timestamp,
  exp: timestamp + expires,
  roles: ['ROLE_ADMIN', 'ROLE_CONTRIBUTOR'],
  username: 'admin@example.com',
} as IUser

const catalogContextValue = {
  catalog: null,
  catalogId: -1,
  catalogs: catalogsGraphql.data.catalogs.edges.map(({ node }) => node),
  localizedCatalog: null,
  localizedCatalogId: -1,
  onCatalogIdChange: (): void => void null,
  onLocalizedCatalogIdChange: (): void => void null,
} as ICatalogContext

function TestProvider(props: IProps): JSX.Element {
  const { api, children } = props

  const userContextValue = useMemo(
    () => ({ user, setToken: () => void null }),
    []
  )

  return (
    <userContext.Provider value={userContextValue}>
      <schemaContext.Provider value={api}>
        <catalogContext.Provider value={catalogContextValue}>
          <categoryContext.Provider
            value={categoriesGraphql.data.getCategoryTree.categories}
          >
            <RequestedPathProvider>{children}</RequestedPathProvider>
          </categoryContext.Provider>
        </catalogContext.Provider>
      </schemaContext.Provider>
    </userContext.Provider>
  )
}

export default TestProvider
