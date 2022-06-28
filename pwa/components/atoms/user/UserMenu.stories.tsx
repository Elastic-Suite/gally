import { ComponentMeta, ComponentStory } from '@storybook/react'

import UserMenu from './UserMenu'

export default {
  title: 'Atoms/UserMenu',
  component: UserMenu,
} as ComponentMeta<typeof UserMenu>

const Template: ComponentStory<typeof UserMenu> = () => <UserMenu />

export const Default = Template.bind({})
Default.args = {}
