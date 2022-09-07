import { ComponentMeta, ComponentStory } from '@storybook/react'
import Chip from './Chip'

export default {
  title: 'Atoms/Chip',
  component: Chip,
  argTypes: {
    color: {
      options: ['neutral', 'primary', 'success', 'warning', 'error'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof Chip>

const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Text',
  color: 'neutral',
}

export const Removable = Template.bind({})
Removable.args = {
  label: 'Text',
  color: 'neutral',
  onDelete: (): null => null,
}
