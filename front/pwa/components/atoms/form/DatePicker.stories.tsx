import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Dayjs } from 'dayjs'

import DatePickerComponent from './DatePicker'
import DatePickerError from './DatePickerError'

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
    value: {
      control: 'hidden',
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

export const Default = Template.bind({})
Default.args = {
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

const FormErrorTemplate: ComponentStory<typeof DatePickerError> = (args) => {
  const [value, setValue] = useState<Dayjs | null>(null)

  function onChange(value: Dayjs | null): void {
    setValue(value)
  }

  return <DatePickerError {...args} value={value} onChange={onChange} />
}

export const WithError = FormErrorTemplate.bind({})
WithError.args = {
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
  showError: false,
  small: false,
  transparent: false,
}
