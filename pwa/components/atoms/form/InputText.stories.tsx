import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import InputTextComponent from './InputText'
import { InputAdornment } from '@mui/material'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

export default {
  title: 'Atoms/Form',
  component: InputTextComponent,
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
} as ComponentMeta<typeof InputTextComponent>

const Template: ComponentStory<typeof InputTextComponent> = (args) => {
  const { endAdornment, ...props } = args
  const [value, setValue] = useState('')
  const handleChange = (value: string): void => setValue(value)
  return (
    <InputTextComponent
      {...props}
      value={value}
      onChange={handleChange}
      endAdornment={endAdornment}
    />
  )
}

export const InputText = Template.bind({})
InputText.args = {
  id: 'input-text',
  infoTooltip: '',
  label: 'Label',
  placeholder: 'Name',
  required: false,
  disabled: false,
  helperText: '',
  helperIcon: '',
  color: 'primary',
  endAdornment: null,
  small: false,
  transparent: false,
}

export const SearchInputText = Template.bind({})
SearchInputText.args = {
  id: 'input-text',
  infoTooltip: '',
  label: 'Label',
  placeholder: 'Name',
  required: false,
  disabled: false,
  helperText: '',
  helperIcon: '',
  color: 'primary',
  endAdornment: (
    <InputAdornment position="end">
      <IonIcon name="search" />
    </InputAdornment>
  ),
  small: false,
  transparent: false,
}
