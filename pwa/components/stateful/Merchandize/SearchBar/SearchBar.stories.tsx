import { ComponentMeta, ComponentStory } from '@storybook/react'
import SearchBar from './SearchBar'

import { useState } from 'react'

export default {
  title: 'Stateful/Merchandize/SearchBar',
  component: SearchBar,
  argTypes: {
    id: { table: { disable: true } },
    ref: { table: { disable: true } },
    endAdornment: { table: { disable: true } },
    color: {
      options: ['none', 'success', 'error'],
      mapping: {
        none: null,
        success: 'success',
        error: 'error',
      },
      control: { type: 'select' },
    },
    helperIcon: {
      options: ['', 'information-circle', 'checkmark', 'close'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof SearchBar>

const Template: ComponentStory<typeof SearchBar> = (args): JSX.Element => {
  const [val, setVal] = useState('')
  const handleChange = (value: string): void => setVal(value)

  return <SearchBar {...args} value={val} onChange={handleChange} />
}

export const Default = Template.bind({})
Default.args = {
  nbResults: 1011,
}
