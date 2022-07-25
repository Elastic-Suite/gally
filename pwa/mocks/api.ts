import { Api, Field, Operation, Resource } from '@api-platform/api-doc-parser'

export const operation: Operation = {
  deprecated: false,
  expects: undefined,
  method: 'GET',
  name: 'Retrieves the collection of SourceField resources.',
  returns: 'http://www.w3.org/ns/hydra/core#Collection',
  type: 'list',
  types: [
    'http://www.w3.org/ns/hydra/core#Operation',
    'http://schema.org/FindAction',
  ],
}

export const fieldString: Field = {
  deprecated: false,
  description: '',
  embedded: null,
  id: 'http://localhost:3000/mocks/docs.jsonld#SourceField/code',
  maxCardinality: null,
  name: 'code',
  range: 'http://www.w3.org/2001/XMLSchema#string',
  reference: null,
  required: true,
  type: 'string',
}

export const fieldInteger: Field = {
  deprecated: false,
  description: '',
  embedded: null,
  id: 'http://localhost:3000/mocks/docs.jsonld#SourceField/weight',
  maxCardinality: null,
  name: 'weight',
  range: 'http://www.w3.org/2001/XMLSchema#integer',
  reference: null,
  required: false,
  type: 'integer',
}

export const fieldBoolean: Field = {
  deprecated: false,
  description: '',
  embedded: null,
  id: 'http://localhost:3000/mocks/docs.jsonld#SourceField/isearchable',
  maxCardinality: null,
  name: 'searchable',
  range: 'http://www.w3.org/2001/XMLSchema#boolean',
  reference: null,
  required: false,
  type: 'boolean',
}

export const resource: Resource = {
  deprecated: false,
  fields: [fieldString, fieldInteger, fieldBoolean],
  id: 'http://localhost:3000/mocks/docs.jsonld#Metadata',
  name: 'metadata',
  operations: [operation],
  parameters: [],
  readableFields: [fieldString, fieldInteger, fieldBoolean],
  title: 'Metadata',
  url: 'http://localhost:3000/mocks/metadata',
  writableFields: [fieldString, fieldInteger, fieldBoolean],
}

export const fieldRef: Field = {
  deprecated: false,
  description: '',
  embedded: null,
  id: 'http://localhost:3000/mocks/docs.jsonld#SourceField/metadata',
  maxCardinality: 1,
  name: 'metadata',
  range: 'http://localhost:3000/mocks/docs.jsonld#Metadata',
  reference: resource,
  required: true,
  type: 'string',
}

export const resourceWithRef: Resource = {
  deprecated: false,
  fields: [fieldString, fieldInteger, fieldBoolean, fieldRef],
  id: 'http://localhost:3000/mocks/docs.jsonld#SourceField',
  name: 'source_fields',
  operations: [operation],
  parameters: [],
  readableFields: [fieldString, fieldInteger, fieldBoolean, fieldRef],
  title: 'SourceField',
  url: 'http://localhost:3000/mocks/source_fields',
  writableFields: [fieldString, fieldInteger, fieldBoolean, fieldRef],
}

export const api: Api = {
  entrypoint: 'http://localhost:3000/mocks',
  title: 'Elasticsuite API',
  resources: [resource, resourceWithRef],
}
