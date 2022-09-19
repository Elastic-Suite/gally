import { ChangeEvent, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import TextareaComponent from './Textarea'

export default {
  title: 'Atoms/Form',
  component: TextareaComponent,
  argTypes: {
    id: { table: { disable: true } },
  },
} as ComponentMeta<typeof TextareaComponent>

const Template: ComponentStory<typeof TextareaComponent> = (args) => {
  const [value, setValue] = useState('')
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void =>
    setValue(event.target.value)
  return <TextareaComponent {...args} value={value} onChange={handleChange} />
}

export const Textarea = Template.bind({})
Textarea.args = {
  id: 'textarea',
  label: 'Label',
  placeholder: 'Describe your issue',
  required: false,
  disabled: false,
  maxLength: 250,
  error: false,
  resizable: false,
}
