import {
  useApiList,
  useFilters,
  useFiltersRedirect,
  usePage,
  useResource,
  useSearch,
} from '~/hooks'
import {
  IHydraResponse,
  ISearchParameters,
  ISourceField,
  ITabContentProps,
} from '~/types'

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

  const [sourceFields] = useApiList<IHydraResponse<ISourceField>>(
    resource,
    page,
    activeFilters,
    searchValue
  )

  if (sourceFields.error) {
    // eslint-disable-next-line no-console
    console.error(sourceFields.error)
    return <pre>{JSON.stringify(sourceFields.error, null, 2)}</pre>
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

  function handlePageChange(page: number): void {
    setPage(page)
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
        onPageChange={handlePageChange}
        resource={resource}
      />
    </>
  )
}

export default SettingsAttributes
