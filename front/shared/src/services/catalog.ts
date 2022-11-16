import { ICatalog } from '../types'

export function getDefaultCatalog(catalogsData: ICatalog[]): ICatalog | null {
  const defaultCatalog = catalogsData
    ? catalogsData.filter((catalog) =>
        catalog.localizedCatalogs.find((localizedCtl) => localizedCtl.isDefault)
      )[0]
    : null

  if (defaultCatalog) {
    return {
      ...defaultCatalog,
      localizedCatalogs: defaultCatalog.localizedCatalogs.filter(
        (localizedCtl) => localizedCtl.isDefault
      ),
    }
  }
  return null
}

export function getDefaultLocalizedCatalog(catalogsData: ICatalog[]): string {
  const defaultCatalog = getDefaultCatalog(catalogsData)
  return defaultCatalog ? defaultCatalog.localizedCatalogs[0].id.toString() : ''
}

export function getLocalizedCatalog(
  catalog: number,
  localizedCatalog: number,
  catalogsData: ICatalog[]
): string {
  if (catalog === -1) {
    return getDefaultLocalizedCatalog(catalogsData)
  } else if (catalog !== -1 && localizedCatalog === -1) {
    return catalogsData
      .filter((ctl) => ctl.id === catalog)
      .map((ctl) => ctl.localizedCatalogs[0].id)
      .flat()[0]
      .toString()
  }
  return localizedCatalog.toString()
}
