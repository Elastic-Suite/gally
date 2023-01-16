import {
  IFetch,
  IGraphqlProductAggregation,
  IGraphqlViewMoreFacetOption,
} from '@elastic-suite/gally-admin-shared'

export interface IActiveFilter {
  filter: IGraphqlProductAggregation
  value: string
}

export type IActiveFilters = IActiveFilter[]

export type IFilterChange = (
  filter: IGraphqlProductAggregation,
  value: string
) => () => void

export type IFilterMoreOptions = Map<
  IGraphqlProductAggregation,
  IFetch<IGraphqlViewMoreFacetOption[]>
>
