import { useState } from 'react'

import { useApiList, useResource } from '~/hooks'
import { IHydraResponse, ISearchParameters, ISourceField } from '~/types'

import FiltersGuesser from '~/components/stateful/FiltersGuesser/FiltersGuesser'
import TableGuesser from '~/components/stateful/TableGuesser/TableGuesser'

function SettingsAttributes(): JSX.Element {
  const resourceName = 'source_fields'
  const resource = useResource(resourceName)

  const [page, setPage] = useState(0)
  const [activeFilters, setActiveFilters] = useState<ISearchParameters>({})
  const [searchValue, setSearchValue] = useState('')

  const [sourceFields] = useApiList<IHydraResponse<ISourceField>>(
    resource,
    page,
    activeFilters
  )

  if (sourceFields.error) {
    return <>{sourceFields.error.toString()}</>
  } else if (!sourceFields.data) {
    return null
  }

  function handleFilterChange(activeFilters: ISearchParameters): void {
    setActiveFilters(activeFilters)
    setPage(0)
  }

  function handleSearchValue(search: string): void {
    setSearchValue(search)
    setPage(0)
  }

  return (
    <>
      <FiltersGuesser
        activeFilters={activeFilters}
        apiData={sourceFields.data}
        onFilterChange={handleFilterChange}
        onSearch={handleSearchValue}
        resource={resource}
        searchValue={searchValue}
      />
      <TableGuesser
        apiData={sourceFields.data}
        currentPage={page}
        onPageChange={setPage}
        resource={resource}
      />
    </>
  )
}

export default SettingsAttributes
