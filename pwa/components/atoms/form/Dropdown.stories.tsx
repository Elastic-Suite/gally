import { useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import DropDownComponent, { IMultiSelectProps, ISelectProps } from './DropDown'

export default {
  title: 'Atoms/Form',
  component: DropDownComponent,
} as ComponentMeta<typeof DropDownComponent>

export const Dropdown = (args) => {
  const [value, setValue] = useState('')
  const handleChange = (value) => setValue(value)
  return (
    <DropDownComponent
      {...(args as ISelectProps)}
      onChange={handleChange}
      value={value}
    />
  )
}
Dropdown.args = {
  disabled: false,
  label: 'Label',
  options: [
    { label: 'Ten', value: 10 },
    { label: 'Twenty', value: 20 },
    { label: 'Thirty', value: 30 },
    { label: 'Fourty', value: 40, disabled: true },
  ],
  required: false,
}

export const DropdownMultiple = (args) => {
  const [multiValue, setMultiValue] = useState([])
  const handleChange = (value) => setMultiValue(value)
  return (
    <DropDownComponent
      {...(args as IMultiSelectProps)}
      multiple
      onChange={handleChange}
      value={multiValue}
    />
  )
}
DropdownMultiple.args = {
  disabled: false,
  label: 'Label',
  options: [
    { label: 'Ten', value: 10 },
    { label: 'Twenty', value: 20 },
    { label: 'Thirty', value: 30 },
    { label: 'Fourty', value: 40, disabled: true },
  ],
  required: false,
}
