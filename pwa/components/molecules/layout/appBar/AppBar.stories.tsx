import { ComponentMeta, ComponentStory } from '@storybook/react'

import AppBar from './AppBar'

export default {
  title: 'Molecules/AppBar',
  component: AppBar,
} as ComponentMeta<typeof AppBar>

const Template: ComponentStory<typeof AppBar> = () => <AppBar />

export const Default = Template.bind({})
Default.args = {}
