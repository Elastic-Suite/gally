import { ComponentMeta, ComponentStory } from '@storybook/react'
import TwoColsLayout from './TwoColsLayout'

export default {
  title: 'Atoms/TwoColsLayout',
  component: TwoColsLayout,
} as ComponentMeta<typeof TwoColsLayout>

const Template: ComponentStory<typeof TwoColsLayout> = (args) => (
  <TwoColsLayout {...args} />
)

export const Default = Template.bind({})
Default.args = {
  left: 'Hello left',
  children: 'Hello right',
}
