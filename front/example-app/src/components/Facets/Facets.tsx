import { Dispatch, SetStateAction } from 'react'
import { Chip, styled } from '@mui/material'
import { AggregationType, IGraphqlProductAggregation } from 'shared'

import { IActiveFilters, IFilterMoreOptions } from '../../types'

import Facet from './Facet'

const Filters = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: theme.spacing(-0.5),
  '& > :not(style)': {
    margin: theme.spacing(0.5),
  },
}))

function getOptionLabel(
  filter: IGraphqlProductAggregation,
  value: string
): string {
  const option = filter.options.find((option) => option.value === value)
  return option?.label ?? value
}

interface IProps {
  activeFilters: IActiveFilters
  filters: IGraphqlProductAggregation[]
  loadMore: (filter: IGraphqlProductAggregation) => void
  moreOptions: IFilterMoreOptions
  onFilterChange: Dispatch<SetStateAction<IActiveFilters>>
}

function Facets(props: IProps): JSX.Element {
  const { activeFilters, filters, loadMore, moreOptions, onFilterChange } =
    props

  function handleChange(filter: IGraphqlProductAggregation, value: string) {
    return () =>
      onFilterChange((prevState) => {
        const clone = [...prevState]
        // For the following types we only manage one value: replace the previous one with the new one
        if (
          filter.type === AggregationType.CATEGORY ||
          filter.type === AggregationType.SLIDER
        ) {
          const filterIndex = prevState.findIndex(
            (activeFilter) => activeFilter.filter.field === filter.field
          )
          if (filterIndex !== -1) {
            clone.splice(filterIndex, 1, { filter, value })
            return clone
          }
        }
        // Remove existing value if there is one (it means we clicked on a checked checkbox)
        const filterOptionIndex = prevState.findIndex(
          (activeFilter) =>
            activeFilter.filter.field === filter.field &&
            activeFilter.value === value
        )
        if (filterOptionIndex !== -1) {
          clone.splice(filterOptionIndex, 1)
          return clone
        }
        // Add the value for multi-valued filters
        clone.push({ filter, value })
        return clone
      })
  }

  function handleDelete(filter: IGraphqlProductAggregation, value: string) {
    return () =>
      onFilterChange((prevState) => {
        const clone = [...prevState]
        const filterOptionIndex = prevState.findIndex(
          (activeFilter) =>
            activeFilter.filter.field === filter.field &&
            activeFilter.value === value
        )
        if (filterOptionIndex !== -1) {
          clone.splice(filterOptionIndex, 1)
          return clone
        }
      })
  }

  return (
    <div>
      <h2>Filters</h2>
      <Filters>
        {activeFilters.map(({ filter, value }) => (
          <Chip
            key={`${filter.field}-${value}`}
            label={`${filter.label}: ${getOptionLabel(filter, value)}`}
            onDelete={handleDelete(filter, value)}
          />
        ))}
      </Filters>
      {filters?.map((filter) => (
        <Facet
          activeFilters={activeFilters}
          key={filter.field}
          filter={filter}
          loadMore={loadMore}
          moreOptions={moreOptions.get(filter)}
          onChange={handleChange}
        />
      ))}
    </div>
  )
}

export default Facets
