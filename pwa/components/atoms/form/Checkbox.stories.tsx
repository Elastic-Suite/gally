import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import CheckboxComponent from './Checkbox'

export default {
  title: 'Atoms/Form',
  component: CheckboxComponent,
} as ComponentMeta<typeof CheckboxComponent>

const Template: ComponentStory<typeof CheckboxComponent> = (args) => {
  const [checked, setChecked] = useState(false)
  return <CheckboxComponent {...args} checked={checked} onChange={setChecked} />
}

export const Checkbox = Template.bind({})
Checkbox.args = {
  indeterminate: false,
  label: 'Label',
  list: false,
}
