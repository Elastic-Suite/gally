import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import DropDownComponent from './DropDown'
import DropDownError from './DropDownError'

export default {
  title: 'Atoms/Form/Dropdown',
  component: DropDownComponent,
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
} as ComponentMeta<typeof DropDownComponent>

export const Simple: ComponentStory<typeof DropDownComponent> = (args) => {
  const [value, setValue] = useState('')
  const handleChange = (value: string): void => setValue(value)
  return <DropDownComponent {...args} onChange={handleChange} value={value} />
}
Simple.args = {
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
  options: [
    { label: 'Ten', value: 10 },
    { label: 'Twenty', value: 20 },
    { label: 'Thirty', value: 30 },
    { label: 'Fourty', value: 40, disabled: true },
    { label: 'Fifty', value: 50 },
  ],
  required: false,
  small: false,
  transparent: false,
}

export const Multiple: ComponentStory<typeof DropDownComponent> = (
  args
): JSX.Element => {
  const [multiValue, setMultiValue] = useState([])
  const handleChange = (value: string[]): void => setMultiValue(value)
  return (
    <DropDownComponent
      {...args}
      multiple
      onChange={handleChange}
      value={multiValue}
    />
  )
}
Multiple.args = {
  color: 'primary',
  dirty: false,
  disabled: false,
  error: false,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: '',
  label: 'Label',
  limitTags: 2,
  margin: 'none',
  options: [
    { label: 'Ten', value: 10 },
    { label: 'Twenty', value: 20 },
    { label: 'Thirty', value: 30 },
    { label: 'Fourty', value: 40, disabled: true },
    { label: 'Fifty', value: 50 },
  ],
  required: false,
  small: false,
  transparent: false,
}

export const WithError: ComponentStory<typeof DropDownError> = (args) => {
  const [value, setValue] = useState('')
  const handleChange = (value: string): void => setValue(value)
  return <DropDownError {...args} onChange={handleChange} value={value} />
}
WithError.args = {
  color: 'primary',
  disabled: false,
  fullWidth: false,
  infoTooltip: '',
  label: 'Label',
  margin: 'none',
  options: [
    { label: 'Ten', value: 10 },
    { label: 'Twenty', value: 20 },
    { label: 'Thirty', value: 30 },
    { label: 'Fourty', value: 40, disabled: true },
    { label: 'Fifty', value: 50 },
  ],
  required: true,
  showError: false,
  small: false,
  transparent: false,
}
