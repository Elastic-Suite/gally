import { ILocalizedCatalogs } from '~/types/scope'

export function getUniqueLocalName(data: ILocalizedCatalogs) {
  const languages = data.localizedCatalogs.map((item) => item.localName)
  return [...new Set(languages)]
}
