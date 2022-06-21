import { IJsonldBase, IHydraSupportedClass } from './hydra'

export interface IDocsJsonldContext {
  '@vocab': string
  domain: IJsonldBase
  expects: IJsonldBase
  hydra: string
  owl: string
  range: IJsonldBase
  rdf: string
  rdfs: string
  returns: IJsonldBase
  schema: string
  subClassOf: IJsonldBase
  xmls: string
}

export interface IDocsJsonld extends IJsonldBase {
  '@context': IDocsJsonldContext
  'hydra:entrypoint': string
  'hydra:supportedClass': IHydraSupportedClass[]
  'hydra:title': string
}
