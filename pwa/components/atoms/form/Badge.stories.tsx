import { ComponentMeta, ComponentStory } from '@storybook/react'
import BadgeComponent from './Badge'

export default {
  title: 'Atoms/Form',
  component: BadgeComponent,
  argTypes: {
    color: {
      options: ['', 'success', 'warning', 'error'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof BadgeComponent>

const Template: ComponentStory<typeof BadgeComponent> = (args) => (
  <BadgeComponent {...args} />
)

export const Badge = Template.bind({})
Badge.args = {
  children: 'Text',
  color: '',
}
