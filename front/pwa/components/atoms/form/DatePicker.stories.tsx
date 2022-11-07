import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import DatePicker from './DatePicker'

export default {
  title: 'Atoms/form/DatePicker',
  component: DatePicker,
} as ComponentMeta<typeof DatePicker>

const Template: ComponentStory<typeof DatePicker> = (args) => {
  const [value, setValue] = useState<Dayjs | null>(null)

  function onChange(value: Dayjs | null): void {
    setValue(value)
  }

  return <DatePicker {...args} value={value} onChange={onChange} />
}

export const Radio = Template.bind({})

Radio.args =  {
    color: 'primary',
    disabled: false,
    id: 'input-text',
    infoTooltip: 'infotool tip',
    label: 'Label DatePicker',
    transparent: false,
  }