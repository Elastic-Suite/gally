import { Method } from './fetch'

export enum HydraType {
  ARRAY = 'array',
  BOOLEAN = 'boolean',
  INTEGER = 'integer',
  OBJECT = 'object',
  STRING = 'string',
}

export interface IHydraPropertyTypeRef {
  $ref?: string
}

export interface IHydraPropertyTypeArray {
  type: HydraType.ARRAY
  items: HydraPropertyType
}

export interface IHydraPropertyTypeBoolean {
  type: HydraType.BOOLEAN
}

export interface IHydraPropertyTypeInteger {
  type: HydraType.INTEGER
  default?: number
  minimum?: number
  maximum?: number
}

export interface IHydraPropertyTypeObject {
  type: HydraType.OBJECT
  properties: Record<string, HydraPropertyType>
  required?: string[]
}

export interface IHydraPropertyTypeString {
  type: HydraType.STRING
  format?: string
  nullable?: boolean
}

export type HydraPropertyType =
  | IHydraPropertyTypeRef
  | IHydraPropertyTypeArray
  | IHydraPropertyTypeBoolean
  | IHydraPropertyTypeInteger
  | IHydraPropertyTypeObject
  | IHydraPropertyTypeString

export interface IJsonldContext {
  '@context': string
}

export interface IJsonldType {
  '@type': string | string[]
}

export interface IJsonldId {
  '@id': string
}

export interface IJsonldBase extends IJsonldType, IJsonldId {}

export interface IOwlEquivalentClass {
  'owl:onProperty': IJsonldId
  'owl:allValuesFrom': IJsonldId
}

export interface IRdfsRange {
  'owl:equivalentClass': IOwlEquivalentClass
}

export interface IHydraSupportedOperation extends IJsonldType {
  expects?: string
  'hydra:method': Method
  'hydra:title'?: string
  'rdfs:label': string
  returns: string
}

export interface IHydraProperty extends IJsonldBase {
  domain: string
  'hydra:supportedOperation'?:
    | IHydraSupportedOperation
    | IHydraSupportedOperation[]
  'owl:maxCardinality'?: number
  range?: string
  'rdfs:label': string
  'rdfs:range'?: (IJsonldId | IRdfsRange)[]
}

export interface IHydraSupportedProperty extends IJsonldType {
  'hydra:description'?: string
  'hydra:property': IHydraProperty
  'hydra:readable': boolean
  'hydra:required'?: boolean
  'hydra:title': string
  'hydra:writeable': boolean
}

export interface IHydraSupportedClass extends IJsonldBase {
  'hydra:description'?: string
  'hydra:supportedOperation'?:
    | IHydraSupportedOperation
    | IHydraSupportedOperation[]
  'hydra:supportedProperty': IHydraSupportedProperty[]
  'hydra:title': string
  'rdfs:label'?: string
  subClassOf?: string
}

export interface IHydraMember extends IJsonldType, IJsonldId {
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

export interface IHydraResponse extends IJsonldContext, IJsonldType, IJsonldId {
  'hydra:member': IHydraMember[]
  'hydra:totalItems': number
}
