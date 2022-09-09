import { ComponentMeta, ComponentStory } from '@storybook/react'

import Button from '../../../atoms/buttons/Button'

import TitleBlock from './TitleBlock'

export default {
  title: 'Atoms/TitleBlock',
  component: TitleBlock,
} as ComponentMeta<typeof TitleBlock>

const Template: ComponentStory<typeof TitleBlock> = (args) => (
  <TitleBlock {...args}>
    <Button disabled={false} endIcon="" size="medium" startIcon="">
      Hello world
    </Button>
  </TitleBlock>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Hello',
}
