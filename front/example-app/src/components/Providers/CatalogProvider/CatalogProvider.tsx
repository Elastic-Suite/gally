import { ReactNode, useMemo, useState } from 'react'
import { ICatalog } from 'shared'

import { catalogContext } from '../../../contexts'
import { useApiList, useResource } from '../../../hooks'

interface IProps {
  children: ReactNode
}

function CatalogProvider(props: IProps): JSX.Element {
  const { children } = props
  const [catalogId, setCatalogId] = useState<string | number>('')
  const [localizedCatalogId, setLocalizedCatalogId] = useState<string | number>(
    ''
  )

  const resourceName = 'Catalog'
  const resource = useResource(resourceName)
  const [catalogs] = useApiList<ICatalog>(resource, false)

  const catalog = catalogs.data?.['hydra:member'].find(
    (catalog) => catalog.id === catalogId
  )
  const localizedCatalog = catalog?.localizedCatalogs.find(
    (localizedCatalog) => localizedCatalog.id === localizedCatalogId
  )

  const context = useMemo(
    () => ({
      catalog,
      catalogId,
      catalogs: catalogs.data?.['hydra:member'] ?? [],
      localizedCatalog,
      localizedCatalogId,
      onCatalogIdChange: setCatalogId,
      onLocalizedCatalogIdChange: setLocalizedCatalogId,
    }),
    [catalog, catalogId, catalogs, localizedCatalog, localizedCatalogId]
  )

  return (
    <catalogContext.Provider value={context}>
      {children}
    </catalogContext.Provider>
  )
}

export default CatalogProvider
