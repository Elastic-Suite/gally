import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import Range from './Range'
import RangeError from './RangeError'

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
    helperText: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
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
  error: false,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  placeholder: [],
  required: false,
  small: false,
  suffix: '',
  transparent: false,
}

const FormErrorTemplate: ComponentStory<typeof RangeError> = (args) => {
  const [value, setValue] = useState(['', ''])
  const handleChange = (value: string[]): void => setValue(value)
  return <RangeError {...args} value={value} onChange={handleChange} />
}

export const WithError = FormErrorTemplate.bind({})
WithError.args = {
  color: 'primary',
  disabled: false,
  endAdornment: null,
  fullWidth: false,
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  placeholder: [],
  required: true,
  small: false,
  suffix: '',
  transparent: false,
}
