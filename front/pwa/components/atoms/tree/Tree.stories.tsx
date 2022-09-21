import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ITreeItem } from 'shared'
import categories from '~/public/mocks/categories.json'

import Tree from './Tree'

export default {
  title: 'Atoms/Tree',
  component: Tree,
} as ComponentMeta<typeof Tree>

export const Simple: ComponentStory<typeof Tree> = (args) => {
  const [selectedItem, setSelectedItem] = useState<ITreeItem>()
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  return (
    <Tree
      {...args}
      multiple={false}
      onChange={setSelectedItem}
      onToggle={setOpenItems}
      openItems={openItems}
      value={selectedItem}
    />
  )
}
Simple.args = {
  data: categories.categories,
  search: '',
  small: false,
}

export const Multiple: ComponentStory<typeof Tree> = (args) => {
  const [selectedItems, setSelectedItems] = useState<ITreeItem[]>([])
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  return (
    <Tree
      {...args}
      multiple
      onChange={setSelectedItems}
      onToggle={setOpenItems}
      openItems={openItems}
      value={selectedItems}
    />
  )
}
Multiple.args = {
  data: categories.categories,
  search: '',
  small: false,
}
