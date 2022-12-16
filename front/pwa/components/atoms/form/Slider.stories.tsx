import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import SliderComponent from './Slider'

export default {
  title: 'Atoms/Form/Slider',
  component: SliderComponent,
  argTypes: {
    margin: {
      options: ['dense', 'none', 'normal'],
      control: { type: 'select' },
    },
    helperIcon: {
      options: ['', 'information-circle', 'checkmark', 'close'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof SliderComponent>

const Template: ComponentStory<typeof SliderComponent> = (args) => {
  const [val, setVal] = useState(0)
  return <SliderComponent {...args} value={val} onChange={setVal} />
}

export const Slider = Template.bind({})

Slider.args = {
  error: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: 'Boost value (%)',
  label: 'Label boost value',
  margin: 'none',
}
