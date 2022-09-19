import { ComponentMeta, ComponentStory } from '@storybook/react'

import MenuItemIconComponent from './MenuItemIcon'

export default {
  title: 'Atoms/Menu',
  component: MenuItemIconComponent,
  argTypes: {
    childPadding: {
      description: 'Do not render a link',
    },
    code: {
      description: 'Also used as the icon name',
    },
    isActive: {
      description: 'Only works if childPadding is false',
    },
    isRoot: {
      description:
        'Only works if childPadding and sidebarStateTimeout are true',
    },
  },
} as ComponentMeta<typeof MenuItemIconComponent>

const Template: ComponentStory<typeof MenuItemIconComponent> = (args) => (
  <MenuItemIconComponent {...args} />
)

export const MenuItemIcon = Template.bind({})
MenuItemIcon.args = {
  childPadding: false,
  code: 'airplane-outline',
  href: '#',
  isActive: false,
  isRoot: false,
  label: 'Label',
  lightStyle: false,
  sidebarState: false,
  sidebarStateTimeout: false,
}
