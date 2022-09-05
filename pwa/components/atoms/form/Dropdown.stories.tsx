import { useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import DropDownComponent, { IMultiSelectProps, ISelectProps } from './DropDown'

export default {
  title: 'Atoms/Form',
  component: DropDownComponent,
} as ComponentMeta<typeof DropDownComponent>

export function Dropdown(args: ISelectProps): JSX.Element {
  const [value, setValue] = useState('')
  const handleChange = (value: string): void => setValue(value)
  return <DropDownComponent {...args} onChange={handleChange} value={value} />
}
Dropdown.args = {
  disabled: false,
  label: 'Label',
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

export function DropdownMultiple(args: IMultiSelectProps): JSX.Element {
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
DropdownMultiple.args = {
  disabled: false,
  label: 'Label',
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
