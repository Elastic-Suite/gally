import { ComponentMeta, ComponentStory } from '@storybook/react'
import AddIDToArray from './AddIDToArray'
import { basicRules } from '~/mocks/rules'

export default {
  title: 'Atoms/AddIDToArray',
  component: AddIDToArray,
} as ComponentMeta<typeof AddIDToArray>

const Template: ComponentStory<typeof AddIDToArray> = (args) => (
  <AddIDToArray {...args} />
)

export const Default = Template.bind({})
Default.args = {
  data: basicRules,
}
