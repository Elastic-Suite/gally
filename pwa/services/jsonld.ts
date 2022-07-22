import { IDocs } from '~/store'
import { IFetch, IHydraPropertyTypeRef, IHydraSupportedProperty } from '~/types'

export function getJsonldClass(
  docs: IFetch<IDocs>,
  propertyClass: string
): IHydraSupportedProperty[] {
  if (!propertyClass.startsWith('#')) {
    propertyClass = `#${propertyClass}`
  }
  return docs.data.jsonld['hydra:supportedClass'].find(
    (classes) =>
      classes['@type'] === 'hydra:Class' && classes['@id'] === propertyClass
  )?.['hydra:supportedProperty']
}

export function getJsonldClassRef(
  docs: IFetch<IDocs>,
  apiProperty: IHydraPropertyTypeRef
): IHydraSupportedProperty[] {
  const [_, propertyClass] = /^#\/components\/schemas\/([^.]*)/.exec(
    apiProperty.$ref
  )
  if (propertyClass) {
    return getJsonldClass(docs, propertyClass)
  }
}

export function getJsonldProperty(
  hydraClass: IHydraSupportedProperty[],
  propertyName: string
): IHydraSupportedProperty {
  return hydraClass.find((property) => property['hydra:title'] === propertyName)
}

export function getJsonldLinkClass(
  docs: IFetch<IDocs>,
  propery: IHydraSupportedProperty
): IHydraSupportedProperty[] {
  if (propery['hydra:property']['@type'] === 'hydra:Link') {
    return getJsonldClass(docs, propery['hydra:property'].range)
  }
}
