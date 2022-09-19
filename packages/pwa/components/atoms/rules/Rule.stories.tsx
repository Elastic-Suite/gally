import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { attributeRule, combinationRule } from 'shared'
import RuleOptionsTestProvider from '~/utils/RuleOptionsTestProvider'

import Rule from './Rule'

export default {
  title: 'Atoms/Rules',
  component: Rule,
} as ComponentMeta<typeof Rule>

const Template: ComponentStory<typeof Rule> = (args) => {
  const { rule, ...props } = args
  const [ruleValue, setRuleValue] = useState(rule)
  return (
    <RuleOptionsTestProvider>
      <Rule {...props} onChange={setRuleValue} rule={ruleValue} />
    </RuleOptionsTestProvider>
  )
}

export const AttributeRule = Template.bind({})
AttributeRule.args = {
  rule: attributeRule,
}

export const CombinationRule = Template.bind({})
CombinationRule.args = {
  rule: combinationRule,
}
