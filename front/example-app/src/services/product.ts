import {
  AggregationType,
  ICategoryTypeDefaultFilterInputType,
  IEntityIntegerTypeFilterInput,
  IProductFieldFilterInput,
  ISelectTypeDefaultFilterInputType,
  IStockTypeDefaultFilterInputType,
} from '@elastic-suite/gally-admin-shared'

import { IActiveFilters } from '../types'

/* eslint-disable no-underscore-dangle */
export function getProductFilters(
  activeFilters: IActiveFilters
): IProductFieldFilterInput[] {
  return activeFilters.reduce<IProductFieldFilterInput[]>(
    (data, activeFilter) => {
      const field = activeFilter.filter.field as keyof IProductFieldFilterInput
      let acc = data.find((value) => Object.keys(value)[0] === field)

      if (!acc) {
        acc = {} as IProductFieldFilterInput
        data.push(acc)
      }

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
      } else if (
        activeFilter.filter.type === AggregationType.CHECKBOX ||
        activeFilter.filter.type === AggregationType.HISTOGRAM_DATE ||
        activeFilter.filter.type === AggregationType.HISTOGRAM
      ) {
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
      }

      return data
    },
    []
  )
}
