import { IDocs } from '~/store'
import {
  DataContentType,
  HydraPropertyType,
  HydraType,
  IDocsJsonOperation,
  IFetch,
  IHydraPropertyTypeObject,
  IHydraPropertyTypeRef,
  IHydraSupportedProperty,
  ITableHeader,
  Method,
} from '~/types'

export function isRefProperty(
  apiProperty: HydraPropertyType
): apiProperty is IHydraPropertyTypeRef {
  return '$ref' in apiProperty
}

export function getPropertyRef(
  docs: IFetch<IDocs>,
  apiProperty: IHydraPropertyTypeRef
): IHydraSupportedProperty[] {
  const [_, propertyClass] = /^#\/components\/schemas\/([^.]*)/.exec(
    apiProperty.$ref
  )
  if (propertyClass) {
    return docs.data.jsonld['hydra:supportedClass'].find(
      (classes) =>
        classes['@type'] === 'hydra:Class' &&
        classes['@id'] === `#${propertyClass}`
    )?.['hydra:supportedProperty']
  }
}

export function getApiSchema(
  docs: IFetch<IDocs>,
  api: string,
  verb: Lowercase<Method>
): IDocsJsonOperation {
  return docs.data.json.paths?.[api]?.[verb]
}

export function getApiProperties(
  docs: IFetch<IDocs>,
  api: string,
  verb: Lowercase<Method>
): HydraPropertyType {
  const apiSchema = getApiSchema(docs, api, verb)
  return apiSchema?.responses?.[200]?.content?.['application/ld+json'].schema
}

export function getApiProperty(
  docs: IFetch<IDocs>,
  api: string,
  verb: Lowercase<Method>,
  property = 'hydra:member'
): HydraPropertyType {
  const apiProperties = getApiProperties(
    docs,
    api,
    verb
  ) as IHydraPropertyTypeObject
  return apiProperties?.properties?.[property]
}

export function getApiSupportedProperties(
  docs: IFetch<IDocs>,
  api: string,
  verb: Lowercase<Method>,
  property = 'hydra:member'
): IHydraSupportedProperty[] {
  const apiProperty = getApiProperty(docs, api, verb, property)
  if (isRefProperty(apiProperty)) {
    return getPropertyRef(docs, apiProperty)
  } else if (
    apiProperty.type === HydraType.ARRAY &&
    isRefProperty(apiProperty.items)
  ) {
    return getPropertyRef(docs, apiProperty.items)
  }
}

export function getApiReadableProperties(
  docs: IFetch<IDocs>,
  api: string,
  verb: Lowercase<Method>,
  property = 'hydra:member'
): IHydraSupportedProperty[] {
  const properties = getApiSupportedProperties(docs, api, verb, property)
  return properties.filter(
    (property) =>
      property['hydra:readable'] &&
      property['hydra:property']['@type'] !== 'hydra:Link'
  )
}

export function getPropertyType(
  property: IHydraSupportedProperty
): DataContentType {
  if (property['hydra:property']?.range === 'xmls:boolean') {
    return DataContentType.BOOLEAN
  }
  return DataContentType.STRING
}

export function getPropertyHeader(
  property: IHydraSupportedProperty
): ITableHeader {
  return {
    field: property['hydra:title'],
    headerName: property['hydra:title'], // t('attributes.attributeCode'),
    type: getPropertyType(property),
    editable: property['hydra:writeable'],
  }
}
