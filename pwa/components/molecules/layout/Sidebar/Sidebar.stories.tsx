import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import menu from '../../../../public/mocks/menu.json'
import Sidebar from './Sidebar'

export default {
  title: 'Molecules/MenuSidebar',
  component: Sidebar,
  argTypes: {
    childrenState: { table: { disable: true } },
    onChildToggle: { table: { disable: true } },
  },
} as ComponentMeta<typeof Sidebar>

const Template: ComponentStory<typeof Sidebar> = (args) => {
  const [childrenState, setChildrenState] = useState({})
  function toggleChild(code: string, state: boolean): void {
    setChildrenState({
      ...childrenState,
      [code]: state,
    })
  }
  return (
    <Sidebar
      {...args}
      childrenState={childrenState}
      onChildToggle={toggleChild}
    />
  )
}

export const MenuWithSidebar = Template.bind({})
MenuWithSidebar.args = {
  menu,
  menuItemActive: 'analyze_catalog_structure',
  sidebarState: true,
  sidebarStateTimeout: false,
}
