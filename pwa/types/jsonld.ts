export enum HydraMethod {
  DELETE,
  GET,
  PATCH,
  POST,
  PUT,
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

export interface HydraProperty extends JsonldBase {
  domain: string
  'hydra:supportedOperation'?: HydraSupportedOperation[]
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

export interface HydraSupportedOperation extends JsonldType {
  expects?: string
  'hydra:method': HydraMethod
  'hydra:title'?: string
  'rdfs:label': string
  returns: string
}

export interface HydraSupportedClass extends JsonldBase {
  'hydra:description'?: string
  'hydra:supportedOperation'?: HydraSupportedOperation[]
  'hydra:supportedProperty': HydraSupportedProperty[]
  'hydra:title': string
  'rdfs:label'?: string
  'subClassOf'?: string
}

export interface JsonldContext {
  '@vocab': string
  domain: JsonldBase
  expects: JsonldBase
  hydra: string
  owl: string
  range: JsonldBase
  rdf: string
  rdfs: string
  returns: JsonldBase
  schema: string
  subClassOf: JsonldBase
  xmls: string
}

export interface Jsonld extends JsonldBase {
  '@context': JsonldContext
  'hydra:entrypoint': string
  'hydra:supportedClass': HydraSupportedClass[]
  'hydra:title': string
}
