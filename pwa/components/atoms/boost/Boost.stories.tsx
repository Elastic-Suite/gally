import { ComponentMeta, ComponentStory } from '@storybook/react'
import BoostComponent from './Boost'

export default {
  title: 'Atoms/Boost',
  component: BoostComponent,
} as ComponentMeta<typeof BoostComponent>

const Template: ComponentStory<typeof BoostComponent> = (args) => (
  <BoostComponent {...args} />
)

export const Boost = Template.bind({})
Boost.args = {
  type: 'down' as 'up' | 'down' | 'no boost',
  boostNumber: 1,
  boostMultiplicator: 1.1,
}
