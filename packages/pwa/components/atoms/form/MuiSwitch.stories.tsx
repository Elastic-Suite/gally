import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Switch as SwitchStorybook } from '@mui/material'

export default {
  title: 'Atoms/Form',
  component: SwitchStorybook,
} as ComponentMeta<typeof SwitchStorybook>

const Template: ComponentStory<typeof SwitchStorybook> = (args) => (
  <SwitchStorybook {...args} />
)

export const Switch = Template.bind({})
Switch.args = {
  defaultChecked: true,
  disabled: false,
  value: 'Hello',
}
