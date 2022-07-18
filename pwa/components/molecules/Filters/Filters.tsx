import { FormEvent, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Collapse, InputAdornment, Stack } from '@mui/material'

import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import TertiaryButton from '~/components/atoms/buttons/TertiaryButton'
import InputText from '~/components/atoms/form/InputText'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import Tag from '~/components/atoms/form/Tag'

import {
  ContentForm,
  FacetteBox,
  FilterBox,
  FilterSecondaryButton,
  FilterTertiaryButton,
  FiltersBox,
  FiltersPaper,
  HeaderBox,
  SearchBox,
} from './Filters.styled'
import Filter, { FilterType, IFilter } from './Filter'

interface IActiveFilter {
  filter: IFilter
  label: string
  value: unknown
}

interface IProps {
  activeValues: Record<string, unknown>
  filters: IFilter[]
  filterValues: Record<string, unknown>
  onApply: () => void
  onClear: (filter: IFilter, value: unknown) => void
  onClearAll: () => void
  onFilterChange: (filter: IFilter, value: unknown) => void
  onSearch: (value: string) => void
  searchValue?: string
  showSearch?: boolean
}

function getActiveFilterLabel(filter: IFilter, value: unknown): string {
  let label = `${filter?.label}: ${value}`
  if (filter?.options) {
    const option = filter?.options.find((option) => option.value === value)
    label = `${filter?.label}: ${option?.label}`
  }
  return label
}

function getActiveFilter(
  filter: IFilter,
  value: unknown
): { filter: IFilter; label: string; value: unknown } {
  return { filter, label: getActiveFilterLabel(filter, value), value }
}

function Filters(props: IProps): JSX.Element {
  const {
    activeValues,
    filters,
    filterValues,
    onApply,
    onClear,
    onClearAll,
    onFilterChange,
    onSearch,
    searchValue,
    showSearch,
  } = props
  const [open, setOpen] = useState(false)
  const { t } = useTranslation('common')

  const augmentedFilters = filters.map((filter) => ({
    ...filter,
    options:
      filter.type === FilterType.BOOLEAN && !filter.options
        ? [
            { label: t('filter.yes'), value: true },
            { label: t('filter.no'), value: false },
          ]
        : filter.options,
  }))

  const filterMap = new Map<string, IFilter>(
    augmentedFilters.map((filter) => [filter.id, filter])
  )
  const activeFilters = Object.entries(activeValues)
    .filter(([_, value]) => value !== '')
    .reduce<IActiveFilter[]>((acc, [id, value]) => {
      const filter = filterMap.get(id)
      if (filter.multiple) {
        return acc.concat(
          (value as unknown[]).map((v) => getActiveFilter(filter, v))
        )
      }
      acc.push(getActiveFilter(filter, value))
      return acc
    }, [])

  function toggleFilters(): void {
    setOpen((prevState) => !prevState)
  }

  function handleClear(filter: IFilter, value: unknown): void {
    const filterValue = filterValues[filter.id]
    if (filter.multiple) {
      onClear(
        filter,
        (filterValue as unknown[]).filter((v) => v !== value)
      )
    } else {
      onClear(filter, '')
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onApply()
  }

  return (
    <FiltersPaper elevation={0}>
      <HeaderBox>
        {showSearch ? (
          <SearchBox>
            <InputText
              endAdornment={
                <InputAdornment position="end">
                  <IonIcon name="search" />
                </InputAdornment>
              }
              onChange={onSearch}
              placeholder={t('filters.search')}
              style={{ width: '220px' }}
              value={searchValue}
            />
          </SearchBox>
        ) : null}
        <FilterBox>
          <FilterSecondaryButton onClick={toggleFilters}>
            {t('filters.filter')}
            {activeFilters.length > 0 && ` (${activeFilters.length})`}
          </FilterSecondaryButton>
          <FacetteBox>
            {activeFilters.map(({ filter, label, value }) => (
              <Tag
                key={`${filter.id}-${value}`}
                onIconClick={(): void => handleClear(filter, value)}
              >
                {label}
              </Tag>
            ))}
          </FacetteBox>
          <FilterTertiaryButton onClick={onClearAll}>
            {t('filters.clearAll')}
          </FilterTertiaryButton>
        </FilterBox>
      </HeaderBox>
      <Collapse in={open} timeout="auto">
        <ContentForm onSubmit={handleSubmit}>
          <FiltersBox>
            {augmentedFilters.map((filter) => (
              <Filter
                key={filter.id}
                filter={filter}
                filterValues={filterValues}
                onFilterChange={onFilterChange}
              />
            ))}
          </FiltersBox>
          <Stack spacing={1} direction="row">
            <PrimaryButton type="submit">{t('filters.apply')}</PrimaryButton>
            <TertiaryButton onClick={onClearAll}>
              {t('filters.clearAll')}
            </TertiaryButton>
          </Stack>
        </ContentForm>
      </Collapse>
    </FiltersPaper>
  )
}

export default Filters
