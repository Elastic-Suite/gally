import { useState } from 'react'
import { Chip, styled } from '@mui/material'

import { IActiveFilters, IFilter, IFilterOption } from '../../types'

import Facet from './Facet'

const Filters = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  margin: theme.spacing(-0.5),
  '& > :not(style)': {
    margin: theme.spacing(0.5),
  },
}))

const filters: IFilter[] = [
  {
    field: 'color',
    label: 'Fashion Color',
    options: [
      { label: 'Gold', value: 'gold', count: 42 },
      { label: 'Peach', value: 'peach', count: 33 },
      { label: 'Khaki', value: 'khaki', count: 21 },
      { label: 'Lilac', value: 'lilac', count: 19 },
      { label: 'Rain', value: 'rain', count: 14 },
    ],
    count: 8,
    has_more: true,
  },
  {
    field: 'material',
    label: 'Fashion Material',
    options: [
      { label: 'Cotton', value: 'cotton', count: 45 },
      { label: 'Linen', value: 'linen', count: 30 },
      { label: 'Nylon', value: 'nylon', count: 29 },
      { label: 'Organic Cotton', value: 'organicCotton', count: 12 },
      { label: 'Polyester', value: 'polyester', count: 9 },
    ],
    count: 8,
    has_more: true,
  },
  {
    field: 'style',
    label: 'Fashion Style',
    options: [
      { label: 'Above Knee', value: 'aboveKnee', count: 24 },
      { label: 'Ankle Length', value: 'ankleLength', count: 23 },
      { label: 'Slim Fit', value: 'slimFit', count: 20 },
      { label: 'Wide Leg', value: 'wideLeg', count: 18 },
      { label: 'Capri', value: 'capri', count: 15 },
    ],
    count: 7,
    has_more: true,
  },
  {
    field: 'video',
    label: 'Has Video',
    options: [
      { label: 'Yes', value: '1', count: 58 },
      { label: 'No', value: '0', count: 45 },
    ],
    type: 'boolean',
  },
  {
    field: 'price',
    label: 'Price',
    options: [
      { label: '60-80', value: '60-80', count: 51 },
      { label: '70-80', value: '70-80', count: 32 },
      { label: '80-90', value: '80-90', count: 23 },
    ],
  },
]

function Facets(): JSX.Element {
  const [activeFilters, setActiveFilters] = useState<IActiveFilters>([])

  function handleChange(filter: IFilter, option: IFilterOption) {
    return () =>
      setActiveFilters((prevState) => {
        const clone = [...prevState]
        const filterOptionIndex = prevState.findIndex(
          (activeFilter) =>
            activeFilter.filter === filter && activeFilter.option === option
        )
        if (filterOptionIndex !== -1) {
          clone.splice(filterOptionIndex, 1)
          return clone
        }
        if (filter.type === 'boolean') {
          const filterIndex = prevState.findIndex(
            (activeFilter) => activeFilter.filter === filter
          )
          if (filterIndex !== -1) {
            clone.splice(filterIndex, 1, { filter, option })
            return clone
          }
        }
        clone.push({ filter, option })
        return clone
      })
  }

  return (
    <div>
      <h2>Filters</h2>
      <Filters>
        {activeFilters.map((value) => (
          <Chip
            key={`${value.filter.field}-${value.option.value}`}
            label={`${value.filter.label}: ${value.option.label}`}
            onDelete={handleChange(value.filter, value.option)}
          />
        ))}
      </Filters>
      {filters.map((filter) => (
        <Facet
          activeFilters={activeFilters}
          key={filter.field}
          filter={filter}
          onChange={handleChange}
        />
      ))}
    </div>
  )
}

export default Facets
