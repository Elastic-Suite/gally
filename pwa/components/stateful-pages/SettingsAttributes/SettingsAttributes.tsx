import {
  useApiEditableList,
  useFilters,
  useFiltersRedirect,
  usePage,
  useResource,
  useSearch,
} from '~/hooks'
import { ISearchParameters, ISourceField, ITabContentProps } from '~/types'

import FiltersGuesser from '~/components/stateful/FiltersGuesser/FiltersGuesser'
import TableGuesser from '~/components/stateful/TableGuesser/TableGuesser'

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props
  const resourceName = 'SourceField'
  const resource = useResource(resourceName)

  const [page, setPage] = usePage()
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const [searchValue, setSearchValue] = useSearch()
  useFiltersRedirect(page, activeFilters, searchValue, active)

  const [sourceFields, { massUpdate, update }] =
    useApiEditableList<ISourceField>(resource, page, activeFilters, searchValue)
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
      update(id, { [name]: value })
    }
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
      />
    </>
  )
}

export default SettingsAttributes
