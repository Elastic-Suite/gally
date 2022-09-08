import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChangeEvent, useState } from 'react'

import Switch from './Switch'

export default {
  title: 'Atoms/Form/Switch',
  component: Switch,
} as ComponentMeta<typeof Switch>

const Template: ComponentStory<typeof Switch> = (args): JSX.Element => {
  const [first, setFirst] = useState(true)

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFirst(event.target.checked)
  }

  return <Switch {...args} onChange={onChange} checked={first} />
}

export const Default = Template.bind({})
Default.args = {
  label: 'label',
  labelInfo: 'labelInfo',
  name: 'checkedA',
}
