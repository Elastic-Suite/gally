import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Dayjs } from 'dayjs'

import DoubleDatePickerComponent from './DoubleDatePicker'
import DoubleDatePickerError from './DoubleDatePickerError'

export default {
  title: 'Atoms/form/DoubleDatePicker',
  component: DoubleDatePickerComponent,
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
} as ComponentMeta<typeof DoubleDatePickerComponent>

const Template: ComponentStory<typeof DoubleDatePickerComponent> = (args) => {
  const [value, setValue] = useState<{
    from: Dayjs | null
    to: Dayjs | null
  } | null>({ from: null, to: null })
  function onChange(
    value: { from: Dayjs | null; to: Dayjs | null } | null
  ): void {
    setValue(value)
  }
  return (
    <DoubleDatePickerComponent {...args} value={value} onChange={onChange} />
  )
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

const FormErrorTemplate: ComponentStory<typeof DoubleDatePickerError> = (
  args
) => {
  const [value, setValue] = useState<{
    from: Dayjs | null
    to: Dayjs | null
  } | null>({ from: null, to: null })
  function onChange(
    value: { from: Dayjs | null; to: Dayjs | null } | null
  ): void {
    setValue(value)
  }
  return <DoubleDatePickerError {...args} value={value} onChange={onChange} />
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
