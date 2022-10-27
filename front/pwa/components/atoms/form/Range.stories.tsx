import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import Range from './Range'

export default {
  title: 'Atoms/Form/Range',
  component: Range,
  argTypes: {
    color: {
      options: ['none', 'success', 'error'],
      mapping: {
        none: null,
        success: 'success',
        error: 'error',
      },
      control: { type: 'select' },
    },
    helperIcon: {
      options: ['', 'information-circle', 'checkmark', 'close'],
      control: { type: 'select' },
    },
    id: { table: { disable: true } },
    margin: {
      options: ['dense', 'none', 'normal'],
      control: { type: 'select' },
    },
    ref: { table: { disable: true } },
  },
} as ComponentMeta<typeof Range>

const Template: ComponentStory<typeof Range> = (args) => {
  const [value, setValue] = useState(['', ''])
  const handleChange = (value: string[]): void => setValue(value)
  return <Range {...args} value={value} onChange={handleChange} />
}

export const Default = Template.bind({})
Default.args = {
  color: 'primary',
  dirty: false,
  disabled: false,
  helperText: '',
  helperIcon: '',
  id: 'input-text',
  infoTooltip: '',
  inputProps: {},
  label: 'Label',
  margin: 'none',
  placeholder: [],
  required: false,
  small: false,
  suffix: '',
  transparent: false,
}
