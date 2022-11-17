import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InputAdornment } from '@mui/material'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import InputTextComponent from './InputText'
import InputTextError from './InputTextError'

export default {
  title: 'Atoms/Form/InputText',
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
  return (
    <InputTextComponent
      {...props}
      value={value}
      onChange={handleChange}
      endAdornment={endAdornment}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  color: 'primary',
  dirty: false,
  disabled: false,
  endAdornment: null,
  error: false,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  id: 'input-text',
  infoTooltip: '',
  inputProps: {},
  label: 'Label',
  margin: 'none',
  placeholder: 'Name',
  required: false,
  small: false,
  suffix: '',
  transparent: false,
  type: 'text',
}

export const Search = Template.bind({})
Search.args = {
  color: 'primary',
  dirty: false,
  disabled: false,
  endAdornment: (
    <InputAdornment position="end">
      <IonIcon name="search" />
    </InputAdornment>
  ),
  error: false,
  fullWidth: false,
  helperText: '',
  helperIcon: '',
  id: 'input-text',
  infoTooltip: '',
  inputProps: {},
  label: 'Label',
  margin: 'none',
  placeholder: 'Name',
  required: false,
  small: false,
  suffix: '',
  transparent: false,
  type: 'text',
}

const FormErrorTemplate: ComponentStory<typeof InputTextComponent> = (args) => {
  const [value, setValue] = useState('')
  const handleChange = (value: string): void => setValue(value)
  return <InputTextError {...args} value={value} onChange={handleChange} />
}

export const WithError = FormErrorTemplate.bind({})
WithError.args = {
  color: 'primary',
  disabled: false,
  endAdornment: null,
  fullWidth: false,
  id: 'input-text',
  infoTooltip: '',
  inputProps: {},
  label: 'Label',
  margin: 'none',
  placeholder: 'Name',
  required: true,
  small: false,
  suffix: '',
  transparent: false,
  type: 'text',
}
