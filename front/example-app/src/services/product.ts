import {
  AggregationType,
  ICategoryTypeDefaultFilterInputType,
  IEntityIntegerTypeFilterInput,
  IProductFieldFilterInput,
  ISelectTypeDefaultFilterInputType,
  IStockTypeDefaultFilterInputType,
} from '@elastic-suite/gally-admin-shared'

import { IActiveFilters } from '../types'

export function getProductFilters(
  activeFilters: IActiveFilters
): IProductFieldFilterInput {
  return activeFilters.reduce<IProductFieldFilterInput>((acc, activeFilter) => {
    if (activeFilter.filter.type === AggregationType.CATEGORY) {
      acc[activeFilter.filter.field as keyof IProductFieldFilterInput] = {
        eq: activeFilter.value,
      } as ICategoryTypeDefaultFilterInputType
    } else if (activeFilter.filter.type === AggregationType.BOOLEAN) {
      acc[activeFilter.filter.field as keyof IProductFieldFilterInput] = {
        eq: true,
      } as IStockTypeDefaultFilterInputType
    } else if (activeFilter.filter.type === AggregationType.SLIDER) {
      acc[activeFilter.filter.field as keyof IProductFieldFilterInput] = {
        lte: Number(activeFilter.value),
      } as IEntityIntegerTypeFilterInput
    } else if (activeFilter.filter.type === AggregationType.CHECKBOX) {
      if (!(activeFilter.filter.field in acc)) {
        acc[activeFilter.filter.field as keyof IProductFieldFilterInput] = {
          in: [],
        }
      }
      ;(
        acc[
          activeFilter.filter.field as keyof IProductFieldFilterInput
        ] as ISelectTypeDefaultFilterInputType
      ).in.push(activeFilter.value)
    } else if (activeFilter.filter.type === AggregationType.HISTOGRAM) {
      const field = activeFilter.filter.field as keyof IProductFieldFilterInput
      const arrayValue = activeFilter.value.split('-')
      const [firstValue, secondValue] = arrayValue

      if (!(field in acc)) {
        acc[field] = {}
      }

      if (arrayValue.length > 1) {
        const isFirstValueIsAsterisk = firstValue === '*'
        const isSecondValueIsAsterisk = secondValue === '*'
        let data: Record<string, number> = {}

        if (isFirstValueIsAsterisk && !isSecondValueIsAsterisk) {
          data = { lt: Number(secondValue) }
        } else if (!isFirstValueIsAsterisk && !isSecondValueIsAsterisk) {
          data = { gte: Number(firstValue), lte: Number(secondValue) }
        } else {
          data = { gt: Number(firstValue) }
        }

        ;(acc[field] as Record<string, number>) = data
      } else {
        ;(acc[field] as Record<string, string>).eq = firstValue
      }
    }
    return acc
  }, {})
}
