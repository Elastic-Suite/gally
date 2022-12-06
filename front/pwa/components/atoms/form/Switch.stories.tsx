import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import SwitchComponent from './Switch'

export default {
  title: 'Atoms/Form/Switch',
  component: SwitchComponent,
  argTypes: {
    helperIcon: {
      options: ['', 'information-circle', 'checkmark', 'close'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof SwitchComponent>

const Template: ComponentStory<typeof SwitchComponent> = (
  args
): JSX.Element => {
  const [value, setValue] = useState(true)
  return <SwitchComponent {...args} onChange={setValue} checked={value} />
}

export const Switch = Template.bind({})
Switch.args = {
  disabled: false,
  helperText: '',
  helperIcon: '',
  infoTooltip: '',
  label: 'label',
  margin: 'none',
  name: 'checkedA',
}
