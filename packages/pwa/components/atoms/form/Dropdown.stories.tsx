import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import DropDownComponent from './DropDown'

export default {
  title: 'Atoms/Form',
  component: DropDownComponent,
} as ComponentMeta<typeof DropDownComponent>

export const Dropdown: ComponentStory<typeof DropDownComponent> = (args) => {
  const [value, setValue] = useState('')
  const handleChange = (value: string): void => setValue(value)
  return <DropDownComponent {...args} onChange={handleChange} value={value} />
}
Dropdown.args = {
  disabled: false,
  infoTooltip: 'Helpful info',
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

export const DropdownMultiple: ComponentStory<typeof DropDownComponent> = (
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
DropdownMultiple.args = {
  disabled: false,
  infoTooltip: '',
  label: 'Label',
  limitTags: 2,
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
