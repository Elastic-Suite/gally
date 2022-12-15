import {
  AggregationType,
  ICategoryTypeDefaultFilterInputType,
  IEntityIntegerTypeFilterInput,
  IProductFieldFilterInput,
  ISelectTypeDefaultFilterInputType,
  IStockTypeDefaultFilterInputType,
} from 'shared'

import { IActiveFilters } from '../types'

export function getProductFilters(
  activeFilters: IActiveFilters
): IProductFieldFilterInput {
  return activeFilters.reduce<IProductFieldFilterInput>((acc, activeFilter) => {
    if (
      // todo: remove test using label
      activeFilter.filter.label === 'Category' ||
      activeFilter.filter.type === AggregationType.CATEGORY
    ) {
      acc[activeFilter.filter.field as keyof IProductFieldFilterInput] = {
        eq: activeFilter.value,
      } as ICategoryTypeDefaultFilterInputType
    } else if (
      // todo: remove test using label
      activeFilter.filter.label === 'Stock' ||
      activeFilter.filter.type === AggregationType.STOCK
    ) {
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
    }
    return acc
  }, {})
}
