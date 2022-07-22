import { Api, Field, Resource } from '@api-platform/api-doc-parser'

import { IHydraMember, IHydraResponse, IOptions } from '~/types'

export function getResource(doc: Api, resourceName: string): Resource {
  return doc.resources?.find((resource) => resource.name === resourceName)
}

// See https://github.com/api-platform/admin/blob/main/src/hydra/schemaAnalyzer.ts
export function getFieldType(field: Field): string {
  switch (field.id) {
    case 'http://schema.org/identifier':
      return field.range === 'http://www.w3.org/2001/XMLSchema#integer'
        ? 'integer_id'
        : 'id'
    case 'http://schema.org/email':
      return 'email'
    case 'http://schema.org/url':
      return 'url'
    default:
  }

  if (field.embedded !== null && field.maxCardinality !== 1) {
    return 'array'
  }

  switch (field.range) {
    case 'http://www.w3.org/2001/XMLSchema#array':
      return 'array'
    case 'http://www.w3.org/2001/XMLSchema#integer':
      return 'integer'
    case 'http://www.w3.org/2001/XMLSchema#decimal':
    case 'http://www.w3.org/2001/XMLSchema#float':
      return 'float'
    case 'http://www.w3.org/2001/XMLSchema#boolean':
      return 'boolean'
    case 'http://www.w3.org/2001/XMLSchema#date':
      return 'date'
    case 'http://www.w3.org/2001/XMLSchema#dateTime':
      return 'dateTime'
    default:
      return 'text'
  }
}

export function getOptionsFromApi<T extends IHydraMember>(
  response: IHydraResponse<T>
): IOptions {
  return response['hydra:member'].map((member) => ({
    id: member.id,
    label: member['@id'],
    value: member.id,
  }))
}
