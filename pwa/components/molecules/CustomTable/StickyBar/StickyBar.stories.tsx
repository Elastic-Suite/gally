import { ComponentStory, ComponentMeta } from '@storybook/react'

import StickyBar from './StickyBar'

export default {
  title: 'molecules/CustomTable/StickyBar',
  component: StickyBar,
} as ComponentMeta<typeof StickyBar>

const Template: ComponentStory<typeof StickyBar> = (args) => (
  <StickyBar {...args} />
)

export const Default = Template.bind({})
Default.args = {}
