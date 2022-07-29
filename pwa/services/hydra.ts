import { Api, Field, Resource } from '@api-platform/api-doc-parser'

import { booleanRegexp, fieldIdRegexp } from '~/constants'
import {
  IHydraMember,
  IHydraResponse,
  IOptions,
  ISearchParameters,
} from '~/types'

import { firstLetterLowercase } from './format'

export function getResource(doc: Api, resourceName: string): Resource {
  return doc.resources?.find((resource) => resource.name === resourceName)
}

export function getReadableFieldName(property: string): string {
  const result = booleanRegexp.exec(property)
  if (result?.[1]) {
    return firstLetterLowercase(result[1])
  }
  if (property.endsWith('[]')) {
    return property.slice(0, -2)
  }
  return property
}

export function getFieldNameFromFieldId(id: string): string {
  const match = fieldIdRegexp.exec(id)
  return match?.[1]
}

export function getReadableField(resource: Resource, name: string): Field {
  name = getReadableFieldName(name).toLowerCase()
  return resource.readableFields.find((field) => {
    const fieldName = getFieldNameFromFieldId(field.id)
    return (
      (fieldName && fieldName.toLowerCase() === name) ||
      field.name.toLowerCase() === name
    )
  })
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

export function castFieldParameter(
  field: Field,
  value: string | string[]
): string | number | boolean | (string | number | boolean)[] {
  if (value instanceof Array) {
    return value.map(
      (value) => castFieldParameter(field, value) as string | number | boolean
    )
  }
  if (field.reference) {
    return Number(value)
  }
  switch (field.type) {
    case 'integer':
      return Number(value)
    case 'boolean':
      return value !== 'true' && value !== 'false' ? null : value === 'true'
    default:
      return value
  }
}

export function isFieldValueValid(field: Field, value: unknown): boolean {
  if (value instanceof Array) {
    return value.every((value) => isFieldValueValid(field, value))
  }
  if (field.reference) {
    return typeof value === 'number' && !isNaN(value)
  }
  switch (field.type) {
    case 'integer':
      return typeof value === 'number' && !isNaN(value)
    case 'boolean':
      return typeof value === 'boolean'
    default:
      return typeof value === 'string'
  }
}

export function getFilterParameters(
  resource: Resource,
  parameters: ISearchParameters
): ISearchParameters {
  return Object.fromEntries(
    Object.entries(parameters).reduce((acc, [key, value]) => {
      const field = getReadableField(resource, key)
      if (field) {
        const fieldValue = castFieldParameter(field, value as string | string[])
        if (isFieldValueValid(field, fieldValue)) {
          acc.push([key, fieldValue])
        }
      }
      return acc
    }, [])
  )
}
