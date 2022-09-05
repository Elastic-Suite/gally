import { Box } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import RuleLinkComponent from './RuleLink'

export default {
  title: 'Atoms/Rules',
  component: RuleLinkComponent,
} as ComponentMeta<typeof RuleLinkComponent>

const Template: ComponentStory<typeof RuleLinkComponent> = (args) => (
  <Box sx={{ position: 'relative', height: '26px' }}>
    <RuleLinkComponent {...args} />
  </Box>
)

export const RuleLink = Template.bind({})
RuleLink.args = {
  double: false,
  label: 'if',
  merge: false,
}
