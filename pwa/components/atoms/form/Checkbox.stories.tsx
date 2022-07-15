import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChangeEvent, useState } from 'react'

import CheckboxComponent from './Checkbox'

export default {
  title: 'Atoms/Form',
  component: CheckboxComponent,
} as ComponentMeta<typeof CheckboxComponent>

const Template: ComponentStory<typeof CheckboxComponent> = (args) => {
  const [checked, setChecked] = useState(false)
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setChecked(event.target.checked)
  }
  return (
    <CheckboxComponent {...args} checked={checked} onChange={handleChange} />
  )
}

export const Checkbox = Template.bind({})
Checkbox.args = {
  indeterminate: false,
  label: 'Label',
  list: false,
}
