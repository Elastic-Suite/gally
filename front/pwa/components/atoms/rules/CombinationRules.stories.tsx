import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { complexRule } from 'shared'
import RuleOptionsTestProvider from '~/utils/RuleOptionsTestProvider'

import CombinationRules from './CombinationRules'

export default {
  title: 'Atoms/Rules',
  component: CombinationRules,
} as ComponentMeta<typeof CombinationRules>

const Template: ComponentStory<typeof CombinationRules> = (args) => {
  const { rule, ...props } = args
  const [ruleValue, setRuleValue] = useState(rule)
  return (
    <RuleOptionsTestProvider>
      <CombinationRules {...props} onChange={setRuleValue} rule={ruleValue} />
    </RuleOptionsTestProvider>
  )
}

export const ComplexRule = Template.bind({})
ComplexRule.args = {
  rule: complexRule,
  first: true,
}
