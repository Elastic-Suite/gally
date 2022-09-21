import { ComponentMeta, ComponentStory } from '@storybook/react'

import MassiveSelectionComponent from './MassiveSelection'

export default {
  title: 'Molecules/CustomTable',
  component: MassiveSelectionComponent,
} as ComponentMeta<typeof MassiveSelectionComponent>

const Template: ComponentStory<typeof MassiveSelectionComponent> = (args) => (
  <MassiveSelectionComponent {...args} />
)

export const MassiveSelection = Template.bind({})
MassiveSelection.args = {
  selectionState: false,
}
