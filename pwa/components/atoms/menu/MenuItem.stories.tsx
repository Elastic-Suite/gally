import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import MenuItemComponent from './MenuItem'

export default {
  title: 'Atoms/Menu',
  component: MenuItemComponent,
  argTypes: {
    childrenState: { table: { disable: true } },
    isActive: {
      description: 'Only works if there are no children',
    },
    isBoosts: {
      description: 'Only works if there are children',
    },
    onToggle: { table: { disable: true } },
    words: {
      description: 'Use to check if children should be active',
    },
  },
} as ComponentMeta<typeof MenuItemComponent>

const Template: ComponentStory<typeof MenuItemComponent> = (args) => {
  const [childrenState, setChildrenState] = useState({})
  function toggleChild(code: string, state: boolean): void {
    setChildrenState({
      ...childrenState,
      [code]: state,
    })
  }
  return (
    <MenuItemComponent
      {...args}
      childrenState={childrenState}
      onToggle={toggleChild}
    />
  )
}

export const MenuItem = Template.bind({})
MenuItem.args = {
  code: 'a',
  href: '#',
  isActive: false,
  isBoosts: false,
  label: 'Label',
  sidebarStateTimeout: false,
  words: ['a', 'b'],
}

export const MenuItemWithChildren = Template.bind({})
MenuItemWithChildren.args = {
  code: 'a',
  href: '#',
  isActive: false,
  isBoosts: false,
  label: 'Label',
  menuChildren: [
    { code: 'a_b', label: 'Child 1' },
    { code: 'a_c', label: 'Child 2' },
  ],
  sidebarStateTimeout: false,
  words: ['a', 'b'],
}
