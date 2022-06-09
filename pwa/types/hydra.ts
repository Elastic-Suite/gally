import { Method } from "./fetch"

export enum HydraType {
  ARRAY = 'array',
  BOOLEAN = 'boolean',
  INTEGER = 'integer',
  OBJECT = 'object',
  STRING = 'string',
}

export interface HydraPropertyTypeRef {
  $ref?: string
}

export interface HydraPropertyTypeArray {
  type: HydraType.ARRAY
  items: HydraPropertyType
}

export interface HydraPropertyTypeBoolean {
  type: HydraType.BOOLEAN
}

export interface HydraPropertyTypeInteger {
  type: HydraType.INTEGER
  default?: number
  minimum?: number
  maximum?: number
}

export interface HydraPropertyTypeObject {
  type: HydraType.OBJECT
  properties: Record<string, HydraPropertyType>
  required?: string[]
}

export interface HydraPropertyTypeString {
  type: HydraType.STRING
  format?: string
  nullable?: boolean
}

export type HydraPropertyType = HydraPropertyTypeRef
  | HydraPropertyTypeArray
  | HydraPropertyTypeBoolean
  | HydraPropertyTypeInteger
  | HydraPropertyTypeObject
  | HydraPropertyTypeString

export interface DocsJsonldType {
  '@type': string | string[]
}

export interface DocsJsonldId {
  '@id': string
}

export interface DocsJsonldBase extends DocsJsonldType, DocsJsonldId {}

export interface OwlEquivalentClass {
  'owl:onProperty': DocsJsonldId
  'owl:allValuesFrom': DocsJsonldId
}

export interface RdfsRange {
  'owl:equivalentClass': OwlEquivalentClass
}

export interface HydraSupportedOperation extends DocsJsonldType {
  expects?: string
  'hydra:method': Method
  'hydra:title'?: string
  'rdfs:label': string
  returns: string
}

export interface HydraProperty extends DocsJsonldBase {
  domain: string
  'hydra:supportedOperation'?: HydraSupportedOperation | HydraSupportedOperation[]
  'owl:maxCardinality'?: number
  range?: string
  'rdfs:label': string
  'rdfs:range'?: (DocsJsonldId | RdfsRange)[]
}

export interface HydraSupportedProperty extends DocsJsonldType {
  'hydra:description'?: string
  'hydra:property': HydraProperty
  'hydra:readable': boolean
  'hydra:required'?: boolean
  'hydra:title': string
  'hydra:writeable': boolean
}

export interface HydraSupportedClass extends DocsJsonldBase {
  'hydra:description'?: string
  'hydra:supportedOperation'?: HydraSupportedOperation | HydraSupportedOperation[]
  'hydra:supportedProperty': HydraSupportedProperty[]
  'hydra:title': string
  'rdfs:label'?: string
  'subClassOf'?: string
}
