import { MouseEvent, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'

import { DataContentType, IHydraMember, IHydraResponse, ITableRow } from '~/types'

import { useApiFetch } from '~/hooks/useApi'

import PageTile from '~/components/atoms/PageTitle/PageTitle'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'

import Filters from '~/components/molecules/Filters/Filters'
import { FilterType, IFilter } from '~/components/molecules/Filters/Filter'

import CustomTable from '~/components/organisms/CustomTable/CustomTable'

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

  console.log(sourceFields)

  const tableHeaders = [
    {
      field: 'code',
      headerName: t('attributes.attributeCode'),
      type: DataContentType.STRING,
      editable: false,
    },
    {
      field: 'defaultLabel',
      headerName: t('attributes.attributeLabel'),
      type: DataContentType.STRING,
      editable: false,
    },
    {
      field: 'type',
      headerName: t('attributes.attributeType'),
      type: DataContentType.STRING,
      editable: false,
    },
    {
      field: 'filterable',
      headerName: t('attributes.filterable'),
      type: DataContentType.BOOLEAN,
      editable: false,
    },
    {
      field: 'searchable',
      headerName: t('attributes.searchable'),
      type: DataContentType.BOOLEAN,
      editable: false,
    },
    {
      field: 'sortable',
      headerName: t('attributes.sortable'),
      type: DataContentType.BOOLEAN,
      editable: false,
    },
  ]

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
      <CustomTable
        currentPage={0}
        onMassiveAction={handleMassiveAction}
        onPageChange={handlePageChange}
        rowsPerPage={50}
        rowsPerPageOptions={[]}
        tableHeaders={tableHeaders}
        tableRows={sourceFields.data['hydra:member'] as unknown as ITableRow[]}
        totalPages={sourceFields.data['hydra:totalItems']}
        withSelection
      />
    </>
  )
}

export default Attributes
