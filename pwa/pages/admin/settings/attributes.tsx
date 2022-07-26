import { useState } from 'react'
import { useTranslation } from 'next-i18next'

import { useApiList, useResource } from '~/hooks'
import { IHydraResponse, ISearchParameters, ISourceField } from '~/types'

import PageTile from '~/components/atoms/PageTitle/PageTitle'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'

import FiltersGuesser from '~/components/stateful/FiltersGuesser/FiltersGuesser'
import TableGuesser from '~/components/stateful/TableGuesser/TableGuesser'

function Attributes(): JSX.Element | string {
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
  const { t } = useTranslation('attributes')

  if (sourceFields.error) {
    return sourceFields.error.toString()
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
      <PageTile title={t('page.title')}>
        <PrimaryButton>{t('action.import')} (xlsx)</PrimaryButton>
      </PageTile>
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

export default Attributes
