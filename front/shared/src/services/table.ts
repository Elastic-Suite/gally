import { TFunction } from 'react-i18next'

import { booleanRegexp } from '../constants'
import {
  DataContentType,
  IField,
  IFilter,
  IHydraMapping,
  IHydraMember,
  IHydraResponse,
  IOptions,
  IResource,
  ITableHeader,
} from '../types'

import { getFieldLabelTranslationArgs } from './format'
import { getField, getFieldType } from './hydra'

interface IMapping extends IHydraMapping {
  field: IField
  multiple: boolean
  options?: IOptions<unknown>
}

export function getFieldDataContentType(field: IField): DataContentType {
  if (field.elasticsuite?.input) {
    return field.elasticsuite.input
  }
  const type = getFieldType(field)
  if (type === 'boolean') {
    return DataContentType.BOOLEAN
  }
  return DataContentType.STRING
}

export function getFieldHeader(field: IField, t: TFunction): ITableHeader {
  return {
    field,
    name: field.title,
    label:
      field.property.label ?? t(...getFieldLabelTranslationArgs(field.title)),
    type: getFieldDataContentType(field),
    editable: (field.elasticsuite?.editable ?? true) && field.writeable,
    required: field.required,
  }
}

export function getFilterType(mapping: IMapping): DataContentType {
  return mapping.multiple
    ? DataContentType.DROPDOWN
    : booleanRegexp.test(mapping.property)
    ? DataContentType.BOOLEAN
    : DataContentType.STRING
}

export function getFilter(mapping: IMapping, t: TFunction): IFilter {
  const type = getFilterType(mapping)
  return {
    field: mapping.field,
    id: mapping.variable,
    label: mapping.field
      ? mapping.field.property.label ??
        t(...getFieldLabelTranslationArgs(mapping.field.title))
      : t(...getFieldLabelTranslationArgs(mapping.property)),
    multiple: mapping.multiple,
    options: mapping.options,
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
}
