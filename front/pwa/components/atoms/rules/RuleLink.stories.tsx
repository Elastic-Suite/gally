import { Box } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import RuleOptionsTestProvider from '~/utils/RuleOptionsTestProvider'

import RuleLinkComponent from './RuleLink'

export default {
  title: 'Atoms/Rules',
  component: RuleLinkComponent,
} as ComponentMeta<typeof RuleLinkComponent>

const Template: ComponentStory<typeof RuleLinkComponent> = (args) => (
  <RuleOptionsTestProvider>
    <Box sx={{ position: 'relative', height: '26px' }}>
      <RuleLinkComponent {...args} />
    </Box>
  </RuleOptionsTestProvider>
)

export const RuleLink = Template.bind({})
RuleLink.args = {
  double: false,
  label: 'if',
  merge: false,
}
