import { FormEvent, ReactNode, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Collapse, InputAdornment, Stack } from '@mui/material'
import { IFilter } from 'shared'

import Button from '~/components/atoms/buttons/Button'
import Chip from '~/components/atoms/Chip/Chip'
import InputText from '~/components/atoms/form/InputText'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import FieldGuesser from '~/components/stateful/FieldGuesser/FieldGuesser'

import {
  Container,
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

interface IActiveFilter {
  filter: IFilter
  label: string
  value: unknown
}

interface IProps {
  activeValues: Record<string, unknown>
  children?: ReactNode
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
  if (filter.id.endsWith('[between]')) {
    value = (value as (string | number)[]).join('-')
  }
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
    children,
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

  const filterMap = new Map<string, IFilter>(
    filters.map((filter) => [filter.id, filter])
  )
  const activeFilters = Object.entries(activeValues)
    .filter(([_, value]) => value !== '')
    .reduce<IActiveFilter[]>((acc, [id, value]) => {
      const filter = filterMap.get(id)
      if (filter) {
        if (filter.id.endsWith('[between]')) {
          const val = value as (string | number)[]
          if (val[0] || val[1]) {
            acc.push(getActiveFilter(filter, val))
          }
        } else if (filter.multiple) {
          return acc.concat(
            (value as unknown[]).map((v) => getActiveFilter(filter, v))
          )
        } else {
          acc.push(getActiveFilter(filter, value))
        }
      }
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

  function handleChange(name: string, value: unknown): void {
    const filter = filters.find((filter) => filter.id === name)
    if (filter) {
      onFilterChange(filter, value)
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
              <Chip
                key={`${filter.id}-${value}`}
                label={label}
                onDelete={(): void => handleClear(filter, value)}
              />
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
            {filters.map((filter) => (
              <FieldGuesser
                key={filter.id}
                editable
                name={filter.id}
                onChange={handleChange}
                useDropdownBoolean
                value={filterValues[filter.id]}
                {...filter}
              />
            ))}
          </FiltersBox>
          <Stack spacing={1} direction="row">
            <Button type="submit">{t('filters.apply')}</Button>
            <Button display="tertiary" onClick={onClearAll}>
              {t('filters.clearAll')}
            </Button>
          </Stack>
        </ContentForm>
      </Collapse>
      {Boolean(children) && <Container>{children}</Container>}
    </FiltersPaper>
  )
}

export default Filters
