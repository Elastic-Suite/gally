import { createContext } from 'react'
import { IGraphqlCatalog, ILocalizedCatalog } from 'shared'

interface ICatalogContext {
  catalog: Partial<IGraphqlCatalog>
  catalogId: number
  catalogs: Partial<IGraphqlCatalog>[]
  localizedCatalog: Partial<ILocalizedCatalog>
  localizedCatalogId: number
  onCatalogIdChange?: (catalogId: string) => void
  onLocalizedCatalogIdChange?: (localizedCatalogId: string) => void
}

export const catalogContext = createContext<ICatalogContext>({
  catalog: null,
  catalogId: -1,
  catalogs: [],
  localizedCatalog: null,
  localizedCatalogId: -1,
  onCatalogIdChange: null,
  onLocalizedCatalogIdChange: null,
})
