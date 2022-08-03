import { ComponentMeta, ComponentStory } from '@storybook/react'
import RadioGrp from './RadioGroup'
export default {
  title: 'Atoms/Form',
  component: RadioGrp,
} as ComponentMeta<typeof RadioGrp>

const Template: ComponentStory<typeof RadioGrp> = (args) => (
  <RadioGrp {...args} />
)

export const RadioGroup = Template.bind({})
RadioGroup.args = {
  name: 'radio-buttons-group',
  defaultChecked: true,
  row: true,
  options: [
    { value: 'male', label: 'Label One', disabled: true },
    { value: 'female', label: 'Label Two' },
  ],
}
