import { ComponentMeta, ComponentStory } from '@storybook/react'
import Rulee from './Rule'

export default {
  title: 'Atoms/Rules',
  component: Rulee,
} as ComponentMeta<typeof Rulee>

const Template: ComponentStory<typeof Rulee> = (args) => <Rulee {...args} />

export const Rule = Template.bind({})
Rule.args = {
  blockOne: [
    { label: 'Any', value: 'any' },
    { label: 'All', value: 'all' },
    { label: 'Age', value: 'age' },
  ],
  blockTwo: [
    { label: 'conditions are', value: 'conditions_are' },
    { label: 'is one of', value: 'is_one_of' },
    { label: 'is', value: 'is' },
  ],
  BlockThree: [
    { label: 'true', value: 'true' },
    { label: 'false', value: 'false' },
    { label: 'red', value: 'red' },
  ],
}
