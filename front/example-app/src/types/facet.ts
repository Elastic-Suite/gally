export interface IFilterOption {
  count?: number
  label?: string
  value: string
}

export interface IFilter {
  field: string
  count?: number
  label?: string
  options?: IFilterOption[]
  has_more?: boolean
  type?: string
}

export interface IActiveFilter {
  filter: IFilter
  option: IFilterOption
}

export type IActiveFilters = IActiveFilter[]

export type IFilterChange = (
  filter: IFilter,
  option: IFilterOption
) => () => void
