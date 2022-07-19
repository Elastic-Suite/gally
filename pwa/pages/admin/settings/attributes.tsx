import { MouseEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'

import { IHydraMember, IHydraResponse } from '~/types'

import { useApiFetch } from '~/hooks/useApi'

import PageTile from '~/components/atoms/PageTitle/PageTitle'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'

import Filters from '~/components/molecules/Filters/Filters'
import { FilterType, IFilter } from '~/components/molecules/Filters/Filter'

import ApiTable from '~/components/stateful/ApiTable/ApiTable'

function Attributes(): JSX.Element | string {
  const [sourceFields] = useApiFetch<IHydraResponse<IHydraMember>>('/source_fields')
  const { t } = useTranslation('attributes')

  const filters = useMemo(
    () => [
      { id: 'code', label: t('attributes.attributeCode') },
      { id: 'label', label: t('attributes.attributeLabel') },
      {
        id: 'type',
        label: t('attributes.attributeType'),
        multiple: true,
        options: [
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 },
          { label: 'Three', value: 3 },
          { label: 'Four', value: 4 },
          { label: 'Five', value: 5 },
        ],
        type: FilterType.SELECT,
      },
      {
        id: 'filterable',
        label: t('attributes.filterable'),
        type: FilterType.BOOLEAN,
      },
      {
        id: 'searchable',
        label: t('attributes.searchable'),
        type: FilterType.BOOLEAN,
      },
    ],
    [t]
  )

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

  function handleMassiveAction(action: string): void {
    console.log(action)
  }

  function handlePageChange(
    _: MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void {
    console.log(page)
  }

  if (sourceFields.error) {
    return sourceFields.error.toString()
  } else if (!sourceFields.data) {
    return null
  }

  return (
    <>
      <PageTile title={t('page.title')}>
        <PrimaryButton>{t('action.import')} (xlsx)</PrimaryButton>
      </PageTile>
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
      <ApiTable
        api="/source_fields"
        onMassiveAction={handleMassiveAction}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default Attributes
