import { useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import DropDownComponent, { IMultiSelectProps, ISelectProps } from './DropDown'

export default {
  title: 'Atoms/Form',
  component: DropDownComponent,
} as ComponentMeta<typeof DropDownComponent>

export function Dropdown(args: ISelectProps): JSX.Element {
  const [value, setValue] = useState(20)
  const handleChange = (value: number): void => setValue(value)
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
  ],
  required: false,
  infoTooltip: 'je ne sais pas',
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
  ],
  required: false,
  infoTooltip: 'je ne sais pas',
}
