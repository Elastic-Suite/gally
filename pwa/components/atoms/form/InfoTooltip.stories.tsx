import { ComponentMeta, ComponentStory } from '@storybook/react'
import InfoTooltip from './InfoTooltip'

export default {
  title: 'Atoms/form/InfoTooltip',
  component: InfoTooltip,
} as ComponentMeta<typeof InfoTooltip>

const Template: ComponentStory<typeof InfoTooltip> = (args): JSX.Element => {
  return <InfoTooltip {...args} />
}

export const Default = Template.bind({})
Default.args = {
  text: 'Info',
}
