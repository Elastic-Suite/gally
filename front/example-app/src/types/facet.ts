import { IGraphqlProductAggregation } from 'shared'

export interface IActiveFilter {
  filter: IGraphqlProductAggregation
  value: string
}

export type IActiveFilters = IActiveFilter[]

export type IFilterChange = (
  filter: IGraphqlProductAggregation,
  value: string
) => () => void
