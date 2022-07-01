import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useCallback, useEffect, useState } from 'react'

import { FilterType } from './Filter'
import Filters from './Filters'

export default {
  title: 'Atoms/Filters',
  component: Filters,
} as ComponentMeta<typeof Filters>

const Template: ComponentStory<typeof Filters> = (args) => {
  const initValues = useCallback(
    () =>
      Object.fromEntries(
        args.filters.map((filter) => [filter.id, filter.multiple ? [] : ''])
      ),
    [args.filters]
  )
  const [activeValues, setActiveValues] = useState({})
  const [searchValue, setSearchValue] = useState('')
  const [filterValues, setFilterValues] = useState(initValues())

  useEffect(() => {
    setFilterValues(initValues())
    setActiveValues([])
  }, [args.filters, initValues])

  function handleApply() {
    setActiveValues(filterValues)
  }

  function handleClear(filter, value) {
    setFilterValues((prevState) => ({
      ...prevState,
      [filter.id]: value,
    }))
    setActiveValues((prevState) => ({
      ...prevState,
      [filter.id]: value,
    }))
  }

  function handleClearAll() {
    setSearchValue('')
    setFilterValues(initValues())
    setActiveValues({})
  }

  function handleFilterChange(filter, value) {
    setFilterValues((prevState) => ({
      ...prevState,
      [filter.id]: value,
    }))
  }

  return (
    <Filters
      {...args}
      activeValues={activeValues}
      filterValues={filterValues}
      onApply={handleApply}
      onClear={handleClear}
      onClearAll={handleClearAll}
      onFilterChange={handleFilterChange}
      onSearch={setSearchValue}
      searchValue={searchValue}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  filters: [
    { id: 'code', label: 'Attribute code' },
    { id: 'label', label: 'Label attribute' },
    {
      id: 'type',
      label: 'Attribute type',
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
      label: 'Filterable',
      type: FilterType.BOOLEAN,
    },
    {
      id: 'searchable',
      label: 'Searchable',
      type: FilterType.BOOLEAN,
    },
  ],
  showSearch: false,
}
