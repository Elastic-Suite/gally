import { ComponentMeta, ComponentStory } from '@storybook/react'
import TitleBlock from './TitleBlock'
import PrimaryButton from '../../../atoms/buttons/PrimaryButton'

export default {
  title: 'Atoms/TitleBlock',
  component: TitleBlock,
} as ComponentMeta<typeof TitleBlock>

const Template: ComponentStory<typeof TitleBlock> = (args) => (
  <TitleBlock {...args}>
    <PrimaryButton disabled={false} endIcon="" size="medium" startIcon="">
      Hello world
    </PrimaryButton>
  </TitleBlock>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Hello',
}
