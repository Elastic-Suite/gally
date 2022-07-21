import { useCallback, useState } from 'react'

import { useApiFilters } from '~/hooks'
import { IFilter, IHydraMember, IHydraResponse } from '~/types'

import Filters from '~/components/molecules/Filters/Filters'

interface IProps<T extends IHydraMember> {
  apiData: IHydraResponse<T>
}

function ApiFilters<T extends IHydraMember>(props: IProps<T>): JSX.Element {
  const { apiData } = props
  const filters: IFilter[] = useApiFilters(apiData)

  const initValues = useCallback(
    (): Record<string, unknown | unknown[]> =>
      Object.fromEntries(
        filters.map((filter) => [filter.id, filter.multiple ? [] : ''])
      ),
    [filters]
  )
  const [activeValues, setActiveValues] = useState({})
  const [searchValue, setSearchValue] = useState('')
  const [filterValues, setFilterValues] = useState(initValues())

  function handleApply(): void {
    setActiveValues(filterValues)
  }

  function handleClear(filter: IFilter, value: unknown): void {
    setFilterValues((prevState) => ({
      ...prevState,
      [filter.id]: value,
    }))
    setActiveValues((prevState) => ({
      ...prevState,
      [filter.id]: value,
    }))
  }

  function handleClearAll(): void {
    setSearchValue('')
    setFilterValues(initValues())
    setActiveValues({})
  }

  function handleFilterChange(filter: IFilter, value: unknown): void {
    setFilterValues((prevState) => ({
      ...prevState,
      [filter.id]: value,
    }))
  }

  return (
    <Filters
      activeValues={activeValues}
      filters={filters}
      filterValues={filterValues}
      onApply={handleApply}
      onClear={handleClear}
      onClearAll={handleClearAll}
      onFilterChange={handleFilterChange}
      onSearch={setSearchValue}
      searchValue={searchValue}
      showSearch
    />
  )
}

export default ApiFilters
