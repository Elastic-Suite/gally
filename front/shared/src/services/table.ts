import { TFunction } from 'react-i18next'

import { booleanRegexp } from '../constants'
import {
  DataContentType,
  IField,
  IFieldConfig,
  IHydraMapping,
  IHydraMember,
  IHydraResponse,
  IResource,
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
  } else if (type === 'integer' || type === 'float' || type === 'percentage') {
    return DataContentType.NUMBER
  }
  return DataContentType.STRING
}

const dataContentTypes = Object.values(DataContentType)
export function isDataContentType<T>(
  type: T | DataContentType
): type is DataContentType {
  return dataContentTypes.includes(type as DataContentType)
}

export function getFieldInput(
  field: IField,
  fallback: DataContentType
): DataContentType {
  if (
    field.elasticsuite?.input &&
    isDataContentType(field.elasticsuite.input)
  ) {
    return field.elasticsuite.input
  }
  return fallback
}

export function getFieldHeader(field: IField, t: TFunction): IFieldConfig {
  const type = getFieldDataContentType(field)
  const id = field.title
  const input = getFieldInput(field, type)
  return {
    editable: field.elasticsuite?.editable && field.writeable,
    field,
    id,
    input,
    label:
      field.property.label ?? t(...getFieldLabelTranslationArgs(field.title)),
    name: id,
    required: field.elasticsuite?.required ?? field.required,
    suffix: field.elasticsuite?.input === 'percentage' ? '%' : '',
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

export function getFilter(mapping: IMapping, t: TFunction): IFieldConfig {
  const type = getFilterType(mapping)
  const id = mapping.variable
  const input = getFieldInput(mapping.field, type)
  return {
    editable: true,
    field: mapping.field,
    id,
    input: mapping.variable.endsWith('[between]')
      ? DataContentType.RANGE
      : input,
    label: mapping.field
      ? mapping.field.property.label ??
        t(...getFieldLabelTranslationArgs(mapping.field.title))
      : t(...getFieldLabelTranslationArgs(mapping.property)),
    multiple: mapping.multiple,
    name: id,
    required: false, // Always false for filter
    suffix: mapping.field.elasticsuite?.input === 'percentage' ? '%' : '',
    type,
    validation: mapping.field.elasticsuite?.validation,
  }
}

export function getMappings<T extends IHydraMember>(
  apiData: IHydraResponse<T>,
  resource: IResource
): IMapping[] {
  const mappings: IMapping[] = apiData?.['hydra:search']['hydra:mapping']
    .filter(
      (mapping) =>
        !mapping.variable.endsWith('[lt]') &&
        !mapping.variable.endsWith('[gt]') &&
        !mapping.variable.endsWith('[lte]') &&
        !mapping.variable.endsWith('[gte]')
    )
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
