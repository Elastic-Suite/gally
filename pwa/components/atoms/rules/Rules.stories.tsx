import { ComponentMeta, ComponentStory } from '@storybook/react'
import Rules from './Rules'

export default {
  title: 'Atoms/Rules',
  component: Rules,
} as ComponentMeta<typeof Rules>

const Template: ComponentStory<typeof Rules> = () => <Rules />

export const Default = Template.bind({})
Default.args = {}
