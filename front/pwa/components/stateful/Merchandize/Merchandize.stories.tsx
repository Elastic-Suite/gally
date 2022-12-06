import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import Merchandize from './Merchandize'

export default {
  title: 'Stateful/Merchandize',
  component: Merchandize,
} as ComponentMeta<typeof Merchandize>

const Template: ComponentStory<typeof Merchandize> = (args): JSX.Element => {
  const [catConf, setCatConf] = useState({
    '@id': '/category_configurations/6',
    '@type': 'CategoryConfiguration',
    id: 6,
    category: 'cat',
    defaultSorting: '10',
    isActive: false,
    isVirtual: false,
    name: 'Category',
    useNameInProductSearch: true,
  })

  const handleChange = (name: string, value: boolean | string): void => {
    setCatConf({
      ...catConf,
      [name]: value,
    })
  }

  return <Merchandize catConf={catConf} onChange={handleChange} {...args} />
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
