import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import categories from '~/public/mocks/categories.json'

import TreeSelectorComponent from './TreeSelector'

export default {
  title: 'Atoms/Form',
  component: TreeSelectorComponent,
  argTypes: {
    id: { table: { disable: true } },
  },
} as ComponentMeta<typeof TreeSelectorComponent>

const Template: ComponentStory<typeof TreeSelectorComponent> = (args) => {
  const [value, setValue] = useState([])
  return <TreeSelectorComponent {...args} value={value} onChange={setValue} />
}

export const TreeSelector = Template.bind({})
TreeSelector.args = {
  data: categories.categories,
  label: 'Label',
  required: false,
  disabled: false,
  small: false,
  transparent: false,
}
