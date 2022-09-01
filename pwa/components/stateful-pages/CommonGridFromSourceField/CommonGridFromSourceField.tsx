import { useState } from 'react'

import { defaultPageSize, defaultRowsPerPageOptions } from '~/constants'
import {
  useApiEditableList,
  useFilters,
  useFiltersRedirect,
  usePage,
  useResource,
  useSearch,
} from '~/hooks'
import { ISearchParameters, ISourceField } from '~/types'

import FiltersGuesser from '~/components/stateful/FiltersGuesser/FiltersGuesser'
import TableGuesser from '~/components/stateful/TableGuesser/TableGuesser'

interface IProps {
  active?: boolean
  urlParams?: string
}

function CommonGridFromSourceField(props: IProps): JSX.Element {
  const { active, urlParams } = props

  const resourceName = 'SourceField'
  const resource = useResource(resourceName)
  const [page, setPage] = usePage()
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const [searchValue, setSearchValue] = useSearch()
  useFiltersRedirect(page, activeFilters, searchValue, active ? active : true)

  const rowsPerPageOptions = defaultRowsPerPageOptions
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)

  const [sourceFields, { massUpdate, update }] =
    useApiEditableList<ISourceField>(
      resource,
      page,
      rowsPerPage,
      activeFilters,
      searchValue,
      urlParams ? `${resource.url}${urlParams}` : null
    )
  const { data, error } = sourceFields

  if (error || !data) {
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

  function handlePageChange(page: number): void {
    setPage(page)
  }

  function handleRowChange(
    id: string | number,
    name: string,
    value: boolean | number | string
  ): void {
    if (update) {
      // todo: should we use optimistic updates ?
      update(id, { [name]: value })
    }
  }

  function onRowsPerPageChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setRowsPerPage(Number(event.target.value))
    setPage(0)
  }

  return (
    <>
      <FiltersGuesser
        activeFilters={activeFilters}
        apiData={data}
        onFilterChange={handleFilterChange}
        onSearch={handleSearchValue}
        resource={resource}
        searchValue={searchValue}
      />
      <TableGuesser
        apiData={data}
        currentPage={page}
        onMassupdate={massUpdate}
        onPageChange={handlePageChange}
        onRowUpdate={handleRowChange}
        resource={resource}
        rowsPerPageOptions={rowsPerPageOptions}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPage={rowsPerPage}
      />
    </>
  )
}

export default CommonGridFromSourceField
