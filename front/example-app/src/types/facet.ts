import {
  IFetch,
  IGraphqlAggregation,
  IGraphqlViewMoreFacetOption,
} from '@elastic-suite/gally-admin-shared'

export interface IActiveFilter {
  filter: IGraphqlAggregation
  value: string
}

export type IActiveFilters = IActiveFilter[]

export type IFilterChange = (
  filter: IGraphqlAggregation,
  value: string
) => () => void

export type IFilterMoreOptions = Map<
  IGraphqlAggregation,
  IFetch<IGraphqlViewMoreFacetOption[]>
>
