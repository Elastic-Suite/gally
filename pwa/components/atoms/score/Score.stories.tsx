import { ComponentMeta, ComponentStory } from '@storybook/react'
import ScoreComponent from './Score'

export default {
  title: 'Atoms/Score',
  component: ScoreComponent,
} as ComponentMeta<typeof ScoreComponent>

const Template: ComponentStory<typeof ScoreComponent> = (args) => (
  <ScoreComponent {...args} />
)

export const Score = Template.bind({})
Score.args = {
  scoreValue: 100.11,
}
