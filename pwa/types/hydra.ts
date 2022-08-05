import { Method } from './fetch'
import {
  IJsonldBase,
  IJsonldBoolean,
  IJsonldContext,
  IJsonldId,
  IJsonldNumber,
  IJsonldRange,
  IJsonldString,
  IJsonldType,
} from './jsonld'

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
  showable?: boolean
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

export interface IHydraMember extends IJsonldBase {
  id: number | string
}

export interface IHydraMapping extends IJsonldType {
  variable: string
  property: string
  required: boolean
}

export interface IHydraSearch extends IJsonldType {
  'hydra:mapping': IHydraMapping[]
  'hydra:template': string
  'hydra:variableRepresentation': string
}

export interface IHydraResponse<Member extends IHydraMember>
  extends IJsonldContext,
    IJsonldType,
    IJsonldId {
  'hydra:member': Member[]
  'hydra:search'?: IHydraSearch
  'hydra:totalItems': number
}

export interface IExpandedHydraSupportedOperation extends IJsonldType {
  'http://www.w3.org/2000/01/rdf-schema#label': [IJsonldString]
  'http://www.w3.org/ns/hydra/core#expects'?: [IJsonldString]
  'http://www.w3.org/ns/hydra/core#method': [IJsonldString]
  'http://www.w3.org/ns/hydra/core#returns': [IJsonldId]
  'http://www.w3.org/ns/hydra/core#title'?: [IJsonldString]
}

export interface IExpandedHydraProperty extends IJsonldBase {
  'http://www.w3.org/2000/01/rdf-schema#domain': [IJsonldId]
  'http://www.w3.org/2000/01/rdf-schema#label': [IJsonldString]
  'http://www.w3.org/2000/01/rdf-schema#range':
    | [IJsonldId]
    | [IJsonldId, IJsonldRange]
  'http://www.w3.org/2002/07/owl#maxCardinality'?: [IJsonldNumber]
  'http://www.w3.org/ns/hydra/core#supportedOperation'?: IExpandedHydraSupportedOperation[]
  'https://localhost/docs.jsonld#showable'?: [IJsonldBoolean]
}

export interface IExpandedHydraSupportedProperty extends IJsonldType {
  'http://www.w3.org/ns/hydra/core#property': IExpandedHydraProperty[]
  'http://www.w3.org/ns/hydra/core#readable': [IJsonldBoolean]
  'http://www.w3.org/ns/hydra/core#required'?: [IJsonldBoolean]
  'http://www.w3.org/ns/hydra/core#title': [IJsonldString]
  'http://www.w3.org/ns/hydra/core#writeable': [IJsonldBoolean]
}

export interface IExpandedHydraSupportedClass extends IJsonldBase {
  'http://www.w3.org/2000/01/rdf-schema#label'?: [IJsonldString]
  'http://www.w3.org/ns/hydra/core#supportedOperation': IExpandedHydraSupportedOperation[]
  'http://www.w3.org/ns/hydra/core#supportedProperty': IExpandedHydraSupportedProperty[]
  'http://www.w3.org/ns/hydra/core#title': [IJsonldString]
}
