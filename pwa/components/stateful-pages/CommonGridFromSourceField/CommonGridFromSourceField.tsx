import { Dispatch, SetStateAction, useState } from 'react'

import { useApiList, useResourceOperations } from '~/hooks'
import { isFetchError } from '~/services'
import { IResource, ISearchParameters, ISourceField } from '~/types'
import { defaultPageSize, defaultRowsPerPageOptions } from '~/constants'

import FiltersGuesser from '~/components/stateful/FiltersGuesser/FiltersGuesser'
import TableGuesser from '~/components/stateful/TableGuesser/TableGuesser'

interface IProps {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  activeFilters: ISearchParameters
  setActiveFilters: Dispatch<SetStateAction<ISearchParameters>>
  searchValue: string
  setSearchValue: Dispatch<SetStateAction<string>>
  resource: IResource
  url?: string
}

function CommonGridFromSourceField(props: IProps): JSX.Element {
  const {
    page,
    setPage,
    activeFilters,
    setActiveFilters,
    searchValue,
    setSearchValue,
    resource,
    url,
  } = props

  const rowsPerPageOptions = defaultRowsPerPageOptions
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)

  const { update } = useResourceOperations<ISourceField>(resource)
  const [sourceFields, updateSourceFields] = useApiList<ISourceField>(
    url ? url : resource,
    page,
    activeFilters,
    searchValue,
    rowsPerPage
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

  async function handleRowChange(
    id: string | number,
    name: string,
    value: boolean | number | string
  ): Promise<void> {
    if (update) {
      // todo: should we use optimistic updates ?
      const sourceField = await update(id, { [name]: value })
      if (!isFetchError(sourceField)) {
        updateSourceFields((items) =>
          items.map((item) => (item.id === sourceField.id ? sourceField : item))
        )
      }
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
        onPageChange={handlePageChange}
        onRowUpdate={handleRowChange}
        resource={resource}
        updateSourceFields={updateSourceFields}
        rowsPerPageOptions={rowsPerPageOptions}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPage={rowsPerPage}
      />
    </>
  )
}

export default CommonGridFromSourceField
