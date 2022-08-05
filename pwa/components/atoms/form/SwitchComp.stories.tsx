import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChangeEvent, useState } from 'react'

import SwitchComp from './SwitchComp'

export default {
  title: 'Atoms/Form/SwitchComp',
  component: SwitchComp,
  decorators: [
    (): JSX.Element => {
      // mock state
      const [first, setFirst] = useState(true)
      const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setFirst(event.target.checked)
      }
      //   console.log(first)

      return (
        <SwitchComp
          label="label"
          labelInfo="labelInfo"
          handleChange={handleChange}
          value={first}
          name="checkedA"
        />
      )
    },
  ],
} as ComponentMeta<typeof SwitchComp>

const Template: ComponentStory<typeof SwitchComp> = (args): JSX.Element => {
  return <SwitchComp {...args} />
}

export const Default = Template.bind({})
Default.args = {}
