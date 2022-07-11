import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import menu from '../../../../public/mocks/menu.json'
import Menu from './Menu'

export default {
  title: 'Molecules/MenuSidebar',
  component: Menu,
  argTypes: {
    childrenState: { table: { disable: true } },
    onChildToggle: { table: { disable: true } },
  },
} as ComponentMeta<typeof Menu>

const Template: ComponentStory<typeof Menu> = (args) => {
  const [childrenState, setChildrenState] = useState({})
  function toggleChild(code: string, state: boolean): void {
    setChildrenState({
      ...childrenState,
      [code]: state,
    })
  }
  return (
    <Menu {...args} childrenState={childrenState} onChildToggle={toggleChild} />
  )
}

export const MenuOnly = Template.bind({})
MenuOnly.args = {
  menu,
  menuItemActive: 'analyze_catalog_structure',
  sidebarState: false,
  sidebarStateTimeout: false,
}
