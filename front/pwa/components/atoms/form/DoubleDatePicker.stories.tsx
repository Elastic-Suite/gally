import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Dayjs } from 'dayjs'
import { useState } from 'react'
import DoubleDatePicker from './DoubleDatePicker'

export default {
  title: 'Atoms/form/DoubleDatePicker',
  component: DoubleDatePicker,
} as ComponentMeta<typeof DoubleDatePicker>

const Template: ComponentStory<typeof DoubleDatePicker> = () => {
    const [value, setValue] = useState<{from: Dayjs | null, to: Dayjs | null} | null>(null)

    function onChange(value: {from: Dayjs | null, to: Dayjs | null} | null): void {
      setValue(value)
    }
  
  return <DoubleDatePicker value={value} onChange={onChange}  />
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