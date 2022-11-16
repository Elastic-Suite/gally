import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import Slider from './Slider'

export default {
  title: 'Atoms/Form/Slider',
  component: Slider,
  argTypes: {
    margin: {
      options: ['dense', 'none', 'normal'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof Slider>

const Template: ComponentStory<typeof Slider> = (args: any) => {
  const [val, setVal] = useState(0)
  return (
    <Slider
      {...args}
      value={val}
      onChange={setVal}
      label="Boost value (%)"
      infoTooltip="boost value ..."
    />
  )
}

export const Default = Template.bind({})
