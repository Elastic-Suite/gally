import { ComponentMeta, ComponentStory } from '@storybook/react'

import StickyBarComponent from './StickyBar'

export default {
  title: 'molecules/CustomTable/StickyBar',
  component: StickyBarComponent,
} as ComponentMeta<typeof StickyBarComponent>

const Template: ComponentStory<typeof StickyBarComponent> = (args) => (
  <StickyBarComponent {...args} />
)

export const StickyBar = Template.bind({})
StickyBar.args = {
  show: true,
}
