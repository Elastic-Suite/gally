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

export const Default: ComponentStory<typeof Chip> = (args) => (
  <Chip {...args} onDelete={null} />
)
Default.args = {
  label: 'Text',
  color: 'neutral',
  small: false,
}

export const Removable: ComponentStory<typeof Chip> = (args) => (
  <Chip {...args} />
)
Removable.args = {
  label: 'Text',
  color: 'neutral',
  onDelete: (): null => null,
  small: false,
}
