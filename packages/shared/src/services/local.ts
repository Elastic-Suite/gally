import { ICatalog } from '../types'

export function getUniqueLocalName(data: ICatalog): string[] {
  const languages = data.localizedCatalogs.map((item) => item.localName)
  return [...new Set(languages)]
}
