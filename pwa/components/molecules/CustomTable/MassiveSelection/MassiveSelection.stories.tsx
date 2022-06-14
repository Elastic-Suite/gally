import { ComponentStory, ComponentMeta } from '@storybook/react'

import MassiveSelection from './MassiveSelection'

export default {
  title: 'Molecules/CustomTable/MassiveSelection',
  component: MassiveSelection,
} as ComponentMeta<typeof MassiveSelection>

const Template: ComponentStory<typeof MassiveSelection> = (args) => (
  <MassiveSelection {...args} />
)

export const Default = Template.bind({})
Default.args = {
  selectionState: false,
}
