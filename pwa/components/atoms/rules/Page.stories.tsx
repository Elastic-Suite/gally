import { ComponentMeta, ComponentStory } from '@storybook/react'
import CombinationRules from './CombinationRules'
import { basicRules } from '~/mocks/rules'

export default {
  title: 'Atoms/Rules',
  component: CombinationRules,
} as ComponentMeta<typeof CombinationRules>

const Template: ComponentStory<typeof CombinationRules> = (args) => (
  <CombinationRules {...args} />
)

export const Page = Template.bind({})
Page.args = {
  rule: basicRules,
  first: true,
}
