import { ComponentMeta, ComponentStory } from '@storybook/react'

import menu from '../../../../public/mocks/menu.json'

import AppBar from './AppBar'

export default {
  title: 'Molecules/AppBar',
  component: AppBar,
} as ComponentMeta<typeof AppBar>

const Template: ComponentStory<typeof AppBar> = (args) => (
  <div style={{ left: 0 }}>
    <AppBar {...args} />
  </div>
)

export const Default = Template.bind({})
Default.args = {
  slug: ['search', 'configuration', 'autocompletion'],
  menu,
}
