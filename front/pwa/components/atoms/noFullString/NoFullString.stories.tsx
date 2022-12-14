import { ComponentMeta, ComponentStory } from '@storybook/react'

import NoFullString from './NoFullString'

export default {
  title: 'Atoms/NoFullString',
  component: NoFullString,
} as ComponentMeta<typeof NoFullString>

const Template: ComponentStory<typeof NoFullString> = (args) => (
  <NoFullString {...args} />
)

export const Default = Template.bind({})
Default.args = {
  name: 'ma limite de charactères est de 28. Vous ne pourrez pas voir ce texte en entier',
  toolTip: true,
  firstLetterUpp: true,
}

export const NoToolTip = Template.bind({})
NoToolTip.args = {
  name: 'ma limite de charactères est de 28. Vous ne pourrez pas voir ce texte en entier',
  firstLetterUpp: true,
}

export const NoFirstLetterUpp = Template.bind({})
NoFirstLetterUpp.args = {
  name: 'ma limite de charactères est de 28. Vous ne pourrez pas voir ce texte en entier',
  toolTip: true,
  firstLetterUpp: false,
}
