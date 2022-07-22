import { TFunction } from 'react-i18next'

import { booleanRegexp } from '~/constants'
import { getFieldLabelTranslationArgs } from './format'
import { getPropertyType } from './hydra'
import {
  FilterType,
  IFetch,
  IFilter,
  IHydraMapping,
  IHydraMember,
  IHydraResponse,
  IHydraSupportedProperty,
  IOptions,
  ITableHeader,
} from '~/types'
import { IDocs } from '~/store'

interface IMapping extends IHydraMapping {
  multiple: boolean
}

export function getPropertyHeader(
  property: IHydraSupportedProperty,
  t: TFunction
): ITableHeader {
  return {
    field: property['hydra:title'],
    headerName: t(...getFieldLabelTranslationArgs(property['hydra:title'])),
    type: getPropertyType(property),
    editable: property['hydra:writeable'],
  }
}

export function getFilterType(mapping: IMapping): FilterType {
  return mapping.multiple
    ? FilterType.SELECT
    : booleanRegexp.test(mapping.property)
    ? FilterType.BOOLEAN
    : FilterType.TEXT
}

export function getFilter(
  _docs: IFetch<IDocs>,
  mapping: IMapping,
  _hydraClass: IHydraSupportedProperty[],
  t: TFunction
): IFilter {
  const type = getFilterType(mapping)
  const options: IOptions = []
  // TODO: load options
  // if (mapping.multiple) {
  //   const property = getJsonldProperty(hydraClass, mapping.property)
  //   const linkedClass = getJsonldLinkClass(docs, property)
  // }
  return {
    id: mapping.property,
    label: t(...getFieldLabelTranslationArgs(mapping.property)),
    multiple: mapping.multiple,
    options,
    type,
  }
}

export function getFilters<T extends IHydraMember>(
  docs: IFetch<IDocs>,
  apiData: IHydraResponse<T>,
  hydraClass: IHydraSupportedProperty[],
  t: TFunction
): IFilter[] {
  const mappings: IMapping[] = apiData?.['hydra:search']['hydra:mapping'].map(
    (mapping) => ({
      ...mapping,
      multiple: mapping.variable.endsWith('[]'),
    })
  )
  const arrayProperties = mappings
    .filter((mapping) => mapping.multiple)
    .map((mapping) => mapping.property)

  return mappings
    ?.filter(
      (mapping) =>
        !arrayProperties.includes(mapping.property) || mapping.multiple
    )
    .map((mapping) => getFilter(docs, mapping, hydraClass, t))
}
