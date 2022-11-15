import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Dayjs } from 'dayjs'

import DoubleDatePickerComponent from './DoubleDatePicker'

export default {
  title: 'Atoms/form/DoubleDatePicker',
  component: DoubleDatePickerComponent,
} as ComponentMeta<typeof DoubleDatePickerComponent>

const Template: ComponentStory<typeof DoubleDatePickerComponent> = () => {
  const [value, setValue] = useState<{
    from: Dayjs | null
    to: Dayjs | null
  } | null>({ from: null, to: null })

  function onChange(
    value: { from: Dayjs | null; to: Dayjs | null } | null
  ): void {
    setValue(value)
  }

  return <DoubleDatePickerComponent value={value} onChange={onChange} />
}

export const DoubleDatePicker = Template.bind({})

DoubleDatePicker.args = {
  color: 'primary',
  disabled: false,
  id: 'input-text',
  infoTooltip: 'infotool tip',
  label: 'Label DatePicker',
  transparent: false,
}
