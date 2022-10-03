import { FormEvent, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import InputTextComponent from './InputText'
import { InputAdornment } from '@mui/material'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

export default {
  title: 'Atoms/Form',
  component: InputTextComponent,
  argTypes: {
    color: {
      options: ['none', 'success', 'error'],
      mapping: {
        none: null,
        success: 'success',
        error: 'error',
      },
      control: { type: 'select' },
    },
    endAdornment: { table: { disable: true } },
    helperIcon: {
      options: ['', 'information-circle', 'checkmark', 'close'],
      control: { type: 'select' },
    },
    id: { table: { disable: true } },
    ref: { table: { disable: true } },
    type: {
      options: ['text', 'number'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof InputTextComponent>

const Template: ComponentStory<typeof InputTextComponent> = (args) => {
  const { endAdornment, ...props } = args
  const [value, setValue] = useState('')

  const handleChange = (value: string): void => setValue(value)
  const handleSubmit = (event: FormEvent): void => event.preventDefault()

  return (
    <form onSubmit={handleSubmit}>
      <InputTextComponent
        {...props}
        value={value}
        onChange={handleChange}
        endAdornment={endAdornment}
      />
    </form>
  )
}

export const InputText = Template.bind({})
InputText.args = {
  color: 'primary',
  dirty: false,
  disabled: false,
  endAdornment: null,
  helperText: '',
  helperIcon: '',
  id: 'input-text',
  infoTooltip: '',
  inputProps: {},
  label: 'Label',
  placeholder: 'Name',
  required: false,
  small: false,
  sufix: '',
  transparent: false,
  type: 'text',
}

export const SearchInputText = Template.bind({})
SearchInputText.args = {
  color: 'primary',
  dirty: false,
  disabled: false,
  endAdornment: (
    <InputAdornment position="end">
      <IonIcon name="search" />
    </InputAdornment>
  ),
  helperText: '',
  helperIcon: '',
  id: 'input-text',
  infoTooltip: '',
  inputProps: {},
  label: 'Label',
  placeholder: 'Name',
  required: false,
  small: false,
  sufix: '',
  transparent: false,
  type: 'text',
}
