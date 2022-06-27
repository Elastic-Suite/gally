import { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import DropDownComponent from './DropDown'

export default {
  title: 'Atoms/Form',
  component: DropDownComponent,
} as ComponentMeta<typeof DropDownComponent>

const Template: ComponentStory<typeof DropDownComponent> = (args) => {
  const [value, setValue] = useState(0)
  const handleChange = (value) => setValue(value)

  return (
    <>
      <DropDownComponent {...args} onChange={handleChange} value={value} />
      <p>Selected value: {value}</p>
    </>
  )
}

export const Dropdown = Template.bind({})
Dropdown.args = {
  label: 'Label',
  required: false,
  disabled: false,
  options: [
    { label: 'Select an item', value: 0 },
    { label: 'Ten', value: 10 },
    { label: 'Twenty', value: 20 },
    { label: 'Thirty', value: 30 },
  ],
}
