import { DocsJsonldBase, HydraSupportedClass } from "./hydra"

export interface DocsJsonldContext {
  '@vocab': string
  domain: DocsJsonldBase
  expects: DocsJsonldBase
  hydra: string
  owl: string
  range: DocsJsonldBase
  rdf: string
  rdfs: string
  returns: DocsJsonldBase
  schema: string
  subClassOf: DocsJsonldBase
  xmls: string
}

export interface DocsJsonld extends DocsJsonldBase {
  '@context': DocsJsonldContext
  'hydra:entrypoint': string
  'hydra:supportedClass': HydraSupportedClass[]
  'hydra:title': string
}
