import { ComponentMeta, ComponentStory } from '@storybook/react'
import CombinationRules from '../rules/CombinationRules'
import { basicRules } from '~/mocks/rules'
import ContainerWithRightOverflow from './ContainerWithRightOverflow'

export default {
  title: 'Atoms/ContainerWithRightOverflow',
  component: ContainerWithRightOverflow,
} as ComponentMeta<typeof ContainerWithRightOverflow>

const Template: ComponentStory<typeof ContainerWithRightOverflow> = (args) => (
  <ContainerWithRightOverflow {...args}>
    <CombinationRules first={true} rule={basicRules} />
  </ContainerWithRightOverflow>
)

export const Default = Template.bind({})
Default.args = {}
