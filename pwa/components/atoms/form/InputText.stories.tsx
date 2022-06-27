import { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import InputTextComponent from './InputText'
import InputAdornment from '@mui/material/InputAdornment'
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
  const [value, setValue] = useState('')
  const handleChange = (event) => setValue(event.target.value)

  return (
    <InputTextComponent
      {...args}
      value={value}
      onChange={handleChange}
      endAdornment={args.endAdornment}
    />
  )
}

export const InputText = Template.bind({})
InputText.args = {
  id: 'input-text',
  label: 'Label',
  placeholder: 'Name',
  required: false,
  disabled: false,
  helperText: '',
  helperIcon: '',
  color: 'none',
  endAdornment: null,
}

export const SearchInputText = Template.bind({})
SearchInputText.args = {
  id: 'input-text',
  label: 'Label',
  placeholder: 'Name',
  required: false,
  disabled: false,
  helperText: '',
  helperIcon: '',
  color: 'none',
  endAdornment: (
    <InputAdornment position="end">
      <IonIcon name="search" />
    </InputAdornment>
  ),
}
