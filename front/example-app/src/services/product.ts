import { IProductFieldFilterInput } from 'shared'

import { IActiveFilters } from '../types'

export function getProductFilters(
  activeFilters: IActiveFilters
): IProductFieldFilterInput {
  return Object.fromEntries(
    activeFilters.map((activeFilter) => [
      activeFilter.filter.field,
      activeFilter.value,
    ])
  ) as IProductFieldFilterInput
}
