import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Dayjs } from 'dayjs'

import DatePickerComponent from './DatePicker'

export default {
  title: 'Atoms/form/DatePicker',
  component: DatePickerComponent,
} as ComponentMeta<typeof DatePickerComponent>

const Template: ComponentStory<typeof DatePickerComponent> = (args) => {
  const [value, setValue] = useState<Dayjs | null>(null)

  function onChange(value: Dayjs | null): void {
    setValue(value)
  }

  return <DatePickerComponent {...args} value={value} onChange={onChange} />
}

export const DatePicker = Template.bind({})

DatePicker.args = {
  color: 'primary',
  disabled: false,
  id: 'input-text',
  infoTooltip: 'infotool tip',
  label: 'Label DatePicker',
  transparent: false,
}
