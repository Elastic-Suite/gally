import { Method } from './fetch'

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

export type HydraPropertyType =
  | HydraPropertyTypeRef
  | HydraPropertyTypeArray
  | HydraPropertyTypeBoolean
  | HydraPropertyTypeInteger
  | HydraPropertyTypeObject
  | HydraPropertyTypeString

export interface JsonldContext {
  '@context': string
}

export interface JsonldType {
  '@type': string | string[]
}

export interface JsonldId {
  '@id': string
}

export interface JsonldBase extends JsonldType, JsonldId {}

export interface OwlEquivalentClass {
  'owl:onProperty': JsonldId
  'owl:allValuesFrom': JsonldId
}

export interface RdfsRange {
  'owl:equivalentClass': OwlEquivalentClass
}

export interface HydraSupportedOperation extends JsonldType {
  expects?: string
  'hydra:method': Method
  'hydra:title'?: string
  'rdfs:label': string
  returns: string
}

export interface HydraProperty extends JsonldBase {
  domain: string
  'hydra:supportedOperation'?:
    | HydraSupportedOperation
    | HydraSupportedOperation[]
  'owl:maxCardinality'?: number
  range?: string
  'rdfs:label': string
  'rdfs:range'?: (JsonldId | RdfsRange)[]
}

export interface HydraSupportedProperty extends JsonldType {
  'hydra:description'?: string
  'hydra:property': HydraProperty
  'hydra:readable': boolean
  'hydra:required'?: boolean
  'hydra:title': string
  'hydra:writeable': boolean
}

export interface HydraSupportedClass extends JsonldBase {
  'hydra:description'?: string
  'hydra:supportedOperation'?:
    | HydraSupportedOperation
    | HydraSupportedOperation[]
  'hydra:supportedProperty': HydraSupportedProperty[]
  'hydra:title': string
  'rdfs:label'?: string
  subClassOf?: string
}

export interface HydraMember extends JsonldType, JsonldId {
  code: string
  defaultLabel: string
  filterable?: boolean
  id: number
  labels: string[]
  metadata: string
  options: string[]
  searchable?: boolean
  sortable?: boolean
  spellchecked?: boolean
  system: boolean
  type: string
  usedForRules?: boolean
  weight?: number
}

export interface HydraResponse extends JsonldContext, JsonldType, JsonldId {
  'hydra:member': HydraMember[]
  'hydra:totalItems': number
}
