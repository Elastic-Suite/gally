import { JsonldBase, HydraSupportedClass } from "./hydra"

export interface DocsJsonldContext {
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

export interface DocsJsonld extends JsonldBase {
  '@context': DocsJsonldContext
  'hydra:entrypoint': string
  'hydra:supportedClass': HydraSupportedClass[]
  'hydra:title': string
}
