import { ComponentMeta, ComponentStory } from '@storybook/react'
import TypesCondition from './TypesConditions'

export default {
  title: 'Atoms/Rules',
  component: TypesCondition,
} as ComponentMeta<typeof TypesCondition>

const Template: ComponentStory<typeof TypesCondition> = (args) => (
  <TypesCondition {...args} />
)

export const TypesConditions = Template.bind({})
TypesConditions.args = {
  big: true,
  simple: true,
  label: 'if',
}
