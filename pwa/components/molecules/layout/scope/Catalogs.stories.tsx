import { ComponentMeta, ComponentStory } from '@storybook/react'
import Catalogs from '~/components/molecules/layout/scope/Catalogs'
import catalog from '../../../../public/mocks/catalog.json'

export default {
  title: 'Molecules/Scopes',
  component: Catalogs,
} as ComponentMeta<typeof Catalogs>

const Template: ComponentStory<typeof Catalogs> = (args) => (
  <Catalogs {...args} />
)

export const Catalog = Template.bind({})
Catalog.args = {
  content: catalog,
}
