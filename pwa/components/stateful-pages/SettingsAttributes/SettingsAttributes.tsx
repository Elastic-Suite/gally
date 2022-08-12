import {
  useApiList,
  useFilters,
  useFiltersRedirect,
  usePage,
  useResource,
  useResourceOperations,
  useSearch,
} from '~/hooks'
import { isFetchError } from '~/services'
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

  const { update } = useResourceOperations<ISourceField>(resource)
  const [sourceFields, updateSourceFields] = useApiList<ISourceField>(
    resource,
    page,
    activeFilters,
    searchValue
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
    field: string,
    value: boolean | number | string
  ): Promise<void> {
    if (update) {
      // todo: should we use optimistic updates ?
      const sourceField = await update(id, { [field]: value })
      if (!isFetchError(sourceField)) {
        updateSourceFields((items) =>
          items.map((item) => (item.id === sourceField.id ? sourceField : item))
        )
      }
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
        onPageChange={handlePageChange}
        onRowUpdate={handleRowChange}
        resource={resource}
        updateSourceFields={updateSourceFields}
      />
    </>
  )
}

export default SettingsAttributes
