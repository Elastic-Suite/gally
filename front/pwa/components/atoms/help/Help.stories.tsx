import { ComponentMeta, ComponentStory } from '@storybook/react'

import Help from './Help'

export default {
  title: 'Atoms/Help',
  component: Help,
} as ComponentMeta<typeof Help>

const Template: ComponentStory<typeof Help> = () => <Help />

export const Default = Template.bind({})
Default.args = {}
