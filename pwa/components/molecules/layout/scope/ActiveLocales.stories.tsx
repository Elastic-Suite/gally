import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ActiveLocales from './ActiveLocales'
import TitleScope from '~/components/atoms/scope/TitleScope'
import NbActiveLocales from '~/components/atoms/scope/NbActiveLocales'
import Language from '~/components/atoms/scope/Language'

const ArrayActiveLocales = [
  'French',
  'English',
  'Us',
  'English',
  'french',
  'French',
  'French',
]
export default {
  title: 'Atoms/Scopes',
  component: ActiveLocales,
} as ComponentMeta<typeof ActiveLocales>

const Template: ComponentStory<typeof ActiveLocales> = (args) => (
  <ActiveLocales {...args} />
)

export const Active_Locales = Template.bind({})
Active_Locales.args = {
  content: [
    <TitleScope name="Total" />,
    <NbActiveLocales number={25} />,
    <Language language={ArrayActiveLocales} limit={false} />,
  ],
}
