import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  FormControlLabel,
  RadioGroup,
  Radio as RadioStorybook,
} from '@mui/material'
export default {
  title: 'Atoms/Form',
  component: RadioGroup,
  argTypes: {
    defaultValue: {
      options: ['male', 'female'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof RadioGroup>

const Template: ComponentStory<typeof RadioGroup> = (args) => (
  <RadioGroup {...args} />
)

export const Radio = Template.bind({})
Radio.args = {
  row: true,
  defaultValue: 'female',
  disabled: true,
  name: 'radio-buttons-group',
  children: (
    <>
      <FormControlLabel
        value="male"
        control={<RadioStorybook defaultChecked />}
        label="Label"
      />{' '}
      <FormControlLabel
        value="female"
        control={<RadioStorybook />}
        label="Label"
      />
    </>
  ),
}
