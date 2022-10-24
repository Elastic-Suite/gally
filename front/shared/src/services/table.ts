import { TFunction } from 'react-i18next'

import { booleanRegexp } from '../constants'
import {
  DataContentType,
  IField,
  IFilter,
  IHydraMapping,
  IHydraMember,
  IHydraResponse,
  IResource,
  ITableHeader,
} from '../types'

import { getFieldLabelTranslationArgs } from './format'
import { getField, getFieldType } from './hydra'

interface IMapping extends IHydraMapping {
  field: IField
  multiple: boolean
}

export function getFieldDataContentType(field: IField): DataContentType {
  const type = getFieldType(field)
  if (type === 'boolean') {
    return DataContentType.BOOLEAN
  } else if (type === 'integer' || type === 'float') {
    return DataContentType.NUMBER
  }
  if (type === 'percentage') {
    return DataContentType.PERCENTAGE
  }
  return DataContentType.STRING
}

export function getFieldHeader(field: IField, t: TFunction): ITableHeader {
  const type = getFieldDataContentType(field)
  return {
    editable: field.elasticsuite?.editable && field.writeable,
    field,
    input: field.elasticsuite?.input ?? type,
    name: field.title,
    label:
      field.property.label ?? t(...getFieldLabelTranslationArgs(field.title)),
    required: field.required,
    type,
    validation: field.elasticsuite?.validation,
  }
}

export function getFilterType(mapping: IMapping): DataContentType {
  return mapping.multiple
    ? DataContentType.SELECT
    : booleanRegexp.test(mapping.property)
    ? DataContentType.BOOLEAN
    : DataContentType.STRING
}

export function getFilter(mapping: IMapping, t: TFunction): IFilter {
  const type = getFilterType(mapping)
  return {
    field: mapping.field,
    id: mapping.variable,
    input: mapping.field.elasticsuite?.input ?? type,
    label: mapping.field
      ? mapping.field.property.label ??
        t(...getFieldLabelTranslationArgs(mapping.field.title))
      : t(...getFieldLabelTranslationArgs(mapping.property)),
    multiple: mapping.multiple,
    type,
  }
}

export function getMappings<T extends IHydraMember>(
  apiData: IHydraResponse<T>,
  resource: IResource
): IMapping[] {
  const mappings: IMapping[] = apiData?.['hydra:search']['hydra:mapping']
    .map((mapping) => ({
      ...mapping,
      field: getField(resource, mapping.property),
      multiple: mapping.variable.endsWith('[]'),
    }))
    .filter((mapping) => mapping.field)
  const arrayProperties = mappings
    .filter((mapping) => mapping.multiple)
    .map((mapping) => mapping.property)

  return mappings
    ?.filter((mapping) => mapping.field.elasticsuite?.visible)
    .filter(
      (mapping) =>
        !arrayProperties.includes(mapping.property) || mapping.multiple
    )
    .sort(
      (a, b) => a.field.elasticsuite?.position - b.field.elasticsuite?.position
    )
}
