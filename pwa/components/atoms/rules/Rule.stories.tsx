import { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { attributeRule, combinationRule } from '~/mocks'

import RuleComponent from './Rule'

export default {
  title: 'Atoms/Rules',
  component: RuleComponent,
} as ComponentMeta<typeof RuleComponent>

const Template: ComponentStory<typeof RuleComponent> = (args) => {
  const { rule, ...props } = args
  const [ruleValue, setRuleValue] = useState(rule)

  function handleChange(name: string, value: unknown): void {
    setRuleValue((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  return <RuleComponent {...props} onChange={handleChange} rule={ruleValue} />
}

export const AttributeRule = Template.bind({})
AttributeRule.args = {
  rule: attributeRule,
}

export const CombinationRule = Template.bind({})
CombinationRule.args = {
  rule: combinationRule,
}
