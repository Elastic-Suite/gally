import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import Merchandize from './Merchandize'

export default {
  title: 'Stateful/Merchandize',
  component: Merchandize,
} as ComponentMeta<typeof Merchandize>

const Template: ComponentStory<typeof Merchandize> = (args): JSX.Element => {
  const [virtualCategoryValue, setVirtualCategoryValue] = useState(true)
  const [categoryNameValue, setCategoryNameValue] = useState(false)
  const [sortValue, setSortValue] = useState('10')

  const onSortChange = (val: string): void => {
    setSortValue(val)
  }

  return (
    <Merchandize
      onVirtualChange={setVirtualCategoryValue}
      virtualCategoryValue={virtualCategoryValue}
      onNameChange={setCategoryNameValue}
      categoryNameValue={categoryNameValue}
      onSortChange={onSortChange}
      sortValue={sortValue}
      {...args}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  sortOptions: [
    { label: 'Position', value: '10' },
    { label: 'Product Name', value: '20' },
    { label: 'Price', value: '30' },
    { label: 'Performance', value: '40' },
  ],
}
