import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import categories from '~/public/mocks/categories.json'

import TreeSelectorComponent from './TreeSelector'

export default {
  title: 'Atoms/Form/TreeSelector',
  component: TreeSelectorComponent,
  argTypes: {
    id: { table: { disable: true } },
  },
} as ComponentMeta<typeof TreeSelectorComponent>

export const Simple: ComponentStory<typeof TreeSelectorComponent> = (args) => {
  const [value, setValue] = useState(null)
  return (
    <TreeSelectorComponent
      {...args}
      value={value}
      multiple={false}
      onChange={setValue}
    />
  )
}
Simple.args = {
  data: categories.categories,
  label: 'Label',
  required: false,
  disabled: false,
  small: false,
  transparent: false,
}

export const Multiple: ComponentStory<typeof TreeSelectorComponent> = (
  args
) => {
  const [value, setValue] = useState([])
  return (
    <TreeSelectorComponent
      {...args}
      value={value}
      multiple
      onChange={setValue}
    />
  )
}
Multiple.args = {
  data: categories.categories,
  label: 'Label',
  required: false,
  disabled: false,
  small: false,
  transparent: false,
}
