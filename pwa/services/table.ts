import { TFunction } from 'react-i18next'
import { Field, Resource } from '@api-platform/api-doc-parser'

import { booleanRegexp } from '~/constants'
import { firstLetterLowercase, getFieldLabelTranslationArgs } from './format'
import { getFieldType } from './hydra'
import {
  DataContentType,
  FilterType,
  IFilter,
  IHydraMapping,
  IHydraMember,
  IHydraResponse,
  IOptions,
  ITableHeader,
} from '~/types'

interface IMapping extends IHydraMapping {
  field: Field
  multiple: boolean
  options?: IOptions
}

export function getFieldDataContentType(field: Field): DataContentType {
  const type = getFieldType(field)
  if (type === 'boolean') {
    return DataContentType.BOOLEAN
  }
  return DataContentType.STRING
}

export function getFieldHeader(field: Field, t: TFunction): ITableHeader {
  return {
    field: field.name,
    headerName: t(...getFieldLabelTranslationArgs(field.name)),
    type: getFieldDataContentType(field),
    editable: false,
  }
}

export function getFilterType(mapping: IMapping): FilterType {
  return mapping.multiple
    ? FilterType.SELECT
    : booleanRegexp.test(mapping.property)
    ? FilterType.BOOLEAN
    : FilterType.TEXT
}

export function getFieldNameFromMapping(mapping: IHydraMapping): string {
  const result = booleanRegexp.exec(mapping.property)
  if (result?.[1]) {
    return firstLetterLowercase(result[1])
  }
  return mapping.property
}

export function getFieldFromMapping(
  mapping: IHydraMapping,
  resource: Resource
): Field {
  const fieldName = getFieldNameFromMapping(mapping)
  return resource.readableFields.find((field) => field.name === fieldName)
}

export function getFilter(mapping: IMapping, t: TFunction): IFilter {
  const type = getFilterType(mapping)
  return {
    id: mapping.variable,
    label: t(...getFieldLabelTranslationArgs(mapping.property)),
    multiple: mapping.multiple,
    options: mapping.options,
    type,
  }
}

export function getMappings<T extends IHydraMember>(
  apiData: IHydraResponse<T>,
  resource: Resource
): IMapping[] {
  const mappings: IMapping[] = apiData?.['hydra:search']['hydra:mapping'].map(
    (mapping) => ({
      ...mapping,
      field: getFieldFromMapping(mapping, resource),
      multiple: mapping.variable.endsWith('[]'),
    })
  )
  const arrayProperties = mappings
    .filter((mapping) => mapping.multiple)
    .map((mapping) => mapping.property)

  return mappings?.filter(
    (mapping) => !arrayProperties.includes(mapping.property) || mapping.multiple
  )
}
