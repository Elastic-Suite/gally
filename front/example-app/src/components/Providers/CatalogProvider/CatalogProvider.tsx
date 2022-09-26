import { ReactNode, useEffect, useMemo, useState } from 'react'
import { IGraphqlCatalogs } from 'shared'

import { catalogsQuery } from '../../../constants'
import { catalogContext } from '../../../contexts'
import { useGraphqlApi } from '../../../hooks'

interface IProps {
  children: ReactNode
}

function CatalogProvider(props: IProps): JSX.Element {
  const { children } = props
  const [catalogId, setCatalogId] = useState<string>('')
  const [localizedCatalogId, setLocalizedCatalogId] = useState<string>('')
  const [catalogs, , load] = useGraphqlApi<IGraphqlCatalogs>(catalogsQuery)

  useEffect(() => {
    load()
  }, [load])

  const context = useMemo(() => {
    const catalog = catalogs.data?.catalogs.edges.find(
      ({ node }) => node.id === catalogId
    )
    const localizedCatalog = catalog?.node.localizedCatalogs.edges.find(
      ({ node }) => node.id === localizedCatalogId
    )
    return {
      catalog: catalog?.node,
      catalogId: Number(catalogId.substring(catalogId.lastIndexOf('/') + 1)),
      catalogs: catalogs.data?.catalogs.edges.map(({ node }) => node) ?? [],
      localizedCatalog: localizedCatalog?.node,
      localizedCatalogId: Number(
        localizedCatalogId.substring(localizedCatalogId.lastIndexOf('/') + 1)
      ),
      onCatalogIdChange: setCatalogId,
      onLocalizedCatalogIdChange: setLocalizedCatalogId,
    }
  }, [catalogId, catalogs, localizedCatalogId])

  return (
    <catalogContext.Provider value={context}>
      {children}
    </catalogContext.Provider>
  )
}

export default CatalogProvider
