import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Dayjs } from 'dayjs'

import DatePickerComponent from './DatePicker'

export default {
  title: 'Atoms/form/DatePicker',
  component: DatePickerComponent,
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
} as ComponentMeta<typeof DatePickerComponent>

const Template: ComponentStory<typeof DatePickerComponent> = (args) => {
  const [value, setValue] = useState<Dayjs | null>(null)

  function onChange(value: Dayjs | null): void {
    setValue(value)
  }

  return <DatePickerComponent {...args} value={value} onChange={onChange} />
}

export const DatePicker = Template.bind({})
DatePicker.args = {
  color: 'primary',
  disabled: false,
  error: false,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  required: false,
  small: false,
  transparent: false,
}
