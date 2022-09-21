import { ComponentMeta, ComponentStory } from '@storybook/react'
import ActiveLocales from './ActiveLocales'
import catalog from '../../../../public/mocks/catalog.json'

export default {
  title: 'Molecules/Scopes',
  component: ActiveLocales,
} as ComponentMeta<typeof ActiveLocales>

const Template: ComponentStory<typeof ActiveLocales> = (args) => (
  <ActiveLocales {...args} />
)

export const Active_Locales = Template.bind({})
Active_Locales.args = {
  content: catalog,
}
