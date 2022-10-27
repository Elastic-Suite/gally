import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import DatePicker from './DatePicker'

export default {
  title: 'Atoms/form/DatePicker',
  component: DatePicker,
} as ComponentMeta<typeof DatePicker>

const Template: ComponentStory<typeof DatePicker> = () => {
  const [value, setValue] = useState<Dayjs | null>(null)

  function onChange(value: Dayjs | null): void {
    setValue(value)
  }

  return <DatePicker date={value} onDate={onChange} />
}

export const Radio = Template.bind({})
