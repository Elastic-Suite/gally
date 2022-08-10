import { ComponentMeta, ComponentStory } from '@storybook/react'

import Alert from './Alert'

export default {
  title: 'Atoms/Alert',
  component: Alert,
} as ComponentMeta<typeof Alert>

const Template: ComponentStory<typeof Alert> = (args) => <Alert {...args} />

export const Default = Template.bind({})
Default.args = {
  message: 'Hello World',
}
