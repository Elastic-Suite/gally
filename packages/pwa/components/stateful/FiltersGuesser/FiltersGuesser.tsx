import { useCallback, useState } from 'react'

import { useApiFilters } from '~/hooks'
import { IFilter, IHydraMember, IHydraResponse, IResource } from 'shared'

import Filters from '~/components/molecules/Filters/Filters'

interface IProps<T extends IHydraMember> {
  activeFilters: Record<string, unknown>
  apiData: IHydraResponse<T>
  onFilterChange: (values: Record<string, unknown>) => void
  onSearch: (value: string) => void
  resource: IResource
  searchValue: string
}

function FiltersGuesser<T extends IHydraMember>(props: IProps<T>): JSX.Element {
  const {
    activeFilters,
    apiData,
    onFilterChange,
    onSearch,
    resource,
    searchValue,
  } = props
  const filters: IFilter[] = useApiFilters(apiData, resource)

  const initValues = useCallback(
    (
      fallback: Record<string, unknown | unknown[]> = {}
    ): Record<string, unknown | unknown[]> =>
      Object.fromEntries(
        filters.map((filter) => [
          filter.id,
          fallback[filter.id] ?? (filter.multiple ? [] : ''),
        ])
      ),
    [filters]
  )
  const [filterValues, setFilterValues] = useState(initValues(activeFilters))

  function handleApply(): void {
    onFilterChange(filterValues)
  }

  function handleClear(filter: IFilter, value: unknown): void {
    setFilterValues((prevState) => ({
      ...prevState,
      [filter.id]: value,
    }))
    onFilterChange({
      ...activeFilters,
      [filter.id]: value,
    })
  }

  function handleClearAll(): void {
    setFilterValues(initValues())
    onSearch('')
    onFilterChange({})
  }

  function handleFilterChange(filter: IFilter, value: unknown): void {
    setFilterValues((prevState) => ({
      ...prevState,
      [filter.id]: value,
    }))
  }

  return (
    <Filters
      activeValues={activeFilters}
      filters={filters}
      filterValues={filterValues}
      onApply={handleApply}
      onClear={handleClear}
      onClearAll={handleClearAll}
      onFilterChange={handleFilterChange}
      onSearch={onSearch}
      searchValue={searchValue}
      showSearch
    />
  )
}

export default FiltersGuesser
