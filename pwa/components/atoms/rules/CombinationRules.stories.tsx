import { ComponentMeta, ComponentStory } from '@storybook/react'

import { complexRule } from '~/mocks'

import CombinationRulesComponent from './CombinationRules'

export default {
  title: 'Atoms/Rules',
  component: CombinationRulesComponent,
} as ComponentMeta<typeof CombinationRulesComponent>

const Template: ComponentStory<typeof CombinationRulesComponent> = (args) => (
  <CombinationRulesComponent {...args} />
)

export const ComplexRule = Template.bind({})
ComplexRule.args = {
  rule: complexRule,
  first: true,
}
