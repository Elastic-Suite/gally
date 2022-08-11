import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChangeEvent, useState } from 'react'

import SwitchLabel from './SwitchLabel'

export default {
  title: 'Atoms/Form/SwitchLabel',
  component: SwitchLabel,
} as ComponentMeta<typeof SwitchLabel>

const Template: ComponentStory<typeof SwitchLabel> = (args): JSX.Element => {
  const [first, setFirst] = useState(true)

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFirst(event.target.checked)
  }

  return <SwitchLabel {...args} onChange={onChange} checked={first} />
}

export const Default = Template.bind({})
Default.args = {
  label: 'label',
  labelInfo: 'labelInfo',
  name: 'checkedA',
}
