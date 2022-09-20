import { useMemo, useState } from 'react'

import {
  useApiEditableList,
  useFilters,
  useFiltersRedirect,
  usePage,
  useResource,
  useSearch,
} from '~/hooks'
import {
  ISearchParameters,
  ISourceField,
  defaultPageSize,
  defaultRowsPerPageOptions,
} from 'shared'

import FiltersGuesser from '~/components/stateful/FiltersGuesser/FiltersGuesser'
import TableGuesser from '~/components/stateful/TableGuesser/TableGuesser'

import NoAttributes from '~/components/atoms/noAttributes/NoAttributes'
import { useTranslation } from 'next-i18next'

function isObjectNotEmpty(object: object): boolean {
  return Object.values(object).some((value) => value)
}
interface IProps {
  active?: boolean
  filters?: ISearchParameters
  urlParams?: string
}

function CommonGridFromSourceField(props: IProps): JSX.Element {
  const { t } = useTranslation('attributes')
  const { active, filters, urlParams } = props

  const resourceName = 'SourceField'
  const resource = useResource(resourceName)
  const [page, setPage] = usePage()
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const [searchValue, setSearchValue] = useSearch()
  const parameters = useMemo(
    () => ({
      ...activeFilters,
      ...filters,
    }),
    [activeFilters, filters]
  )
  useFiltersRedirect(page, activeFilters, searchValue, active ? active : true)

  const rowsPerPageOptions = defaultRowsPerPageOptions
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)

  const [sourceFields, { massUpdate, update }] =
    useApiEditableList<ISourceField>(
      resource,
      page,
      rowsPerPage,
      parameters,
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
      update(id, { [name]: value })
    }
  }

  function onRowsPerPageChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setRowsPerPage(Number(event.target.value))
    setPage(0)
  }

  const filterOrSearchAreUp =
    searchValue !== '' || isObjectNotEmpty(activeFilters)

  return (
    <>
      {data['hydra:member'].length !== 0 || filterOrSearchAreUp ? (
        <FiltersGuesser
          activeFilters={activeFilters}
          apiData={data}
          onFilterChange={handleFilterChange}
          onSearch={handleSearchValue}
          resource={resource}
          searchValue={searchValue}
        />
      ) : null}

      {data['hydra:member'].length === 0 ? (
        filterOrSearchAreUp ? (
          <TableGuesser
            apiData={data}
            onMassupdate={massUpdate}
            onPageChange={handlePageChange}
            resource={resource}
            noResult
          />
        ) : (
          <NoAttributes
            title={t('attributes.none')}
            btnTitle={t('attributes.none.btn')}
            btnHref="admin/settings/attributes"
          />
        )
      ) : (
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
      )}
    </>
  )
}

export default CommonGridFromSourceField
