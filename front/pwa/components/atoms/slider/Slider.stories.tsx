import { ComponentMeta, ComponentStory } from '@storybook/react'

import Slider from './Slider'

export default {
  title: 'Atoms/Slider',
  component: Slider,
  argTypes: {},
} as ComponentMeta<typeof Slider>

const Template: ComponentStory<typeof Slider> = (args: any) => (
  <Slider {...args} />
)

export const Default = Template.bind({})
Default.args = {}
