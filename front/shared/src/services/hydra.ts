import {
  IApi,
  IApiSchemaOptions,
  IField,
  IHydraLabelMember,
  IHydraMember,
  IHydraResponse,
  IOptions,
  IResource,
  ISearchParameters,
} from '../types'

export function getResource(api: IApi, resourceName: string): IResource {
  return api.find(
    (resource) =>
      resource.title === resourceName || resource.label === resourceName
  )
}

export function getFieldName(property: string): string {
  if (property.endsWith('[]')) {
    return property.slice(0, -2)
  }
  return property
}

export function getField(resource: IResource, name: string): IField {
  name = getFieldName(name)
  return resource.supportedProperty.find((field) => {
    return field.title === name
  })
}

export function getFieldType(field: IField): string {
  if (field.elasticsuite?.type) {
    return field.elasticsuite?.type
  }

  switch (field.property?.range['@id']) {
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

export function isReferenceField(field: IField): boolean {
  return field.property['@type'] === 'http://www.w3.org/ns/hydra/core#Link'
}

export function getReferencedResource(api: IApi, field: IField): IResource {
  return api.find((resource) => resource['@id'] === field.property.range['@id'])
}

export function getOptionsFromResource<T extends IHydraMember>(
  response: IHydraResponse<T>
): IOptions<string | number> {
  return response['hydra:member'].map((member) => ({
    id: member.id,
    label: member['@id'],
    value: member.id,
  }))
}

export function getOptionsFromLabelResource<T extends IHydraLabelMember>(
  response: IHydraResponse<T>
): IOptions<string | number> {
  return response['hydra:member'].map((member) => ({
    id: member.id,
    label: member.label,
    value: member.id,
  }))
}

export function getOptionsFromApiSchema(
  response: IHydraResponse<IApiSchemaOptions>
): IOptions<string | number> {
  return response['hydra:member'].map((member) => ({
    id: member.code,
    label: member.label,
    value: member.code,
  }))
}

export function castFieldParameter(
  field: IField,
  value: string | string[]
): string | number | boolean | (string | number | boolean)[] {
  if (value instanceof Array) {
    return value.map(
      (value) => castFieldParameter(field, value) as string | number | boolean
    )
  }
  if (isReferenceField(field)) {
    return Number(value)
  }
  switch (getFieldType(field)) {
    case 'integer':
      return Number(value)
    case 'boolean':
      return value !== 'true' && value !== 'false' ? null : value === 'true'
    default:
      return value
  }
}

export function isFieldValueValid(field: IField, value: unknown): boolean {
  if (value instanceof Array) {
    return value.every((value) => isFieldValueValid(field, value))
  }
  if (isReferenceField(field)) {
    return typeof value === 'number' && !isNaN(value)
  }
  switch (getFieldType(field)) {
    case 'integer':
      return typeof value === 'number' && !isNaN(value)
    case 'boolean':
      return typeof value === 'boolean'
    default:
      return typeof value === 'string'
  }
}

export function getFilterParameters(
  resource: IResource,
  parameters: ISearchParameters
): ISearchParameters {
  return Object.fromEntries(
    Object.entries(parameters).reduce((acc, [key, value]) => {
      const field = getField(resource, key)
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
