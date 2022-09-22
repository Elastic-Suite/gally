import { ComponentMeta, ComponentStory } from '@storybook/react'
import NoAttributes from './NoAttributes'

export default {
  title: 'Atoms/NoAttributes',
  component: NoAttributes,
} as ComponentMeta<typeof NoAttributes>

const Template: ComponentStory<typeof NoAttributes> = (args) => (
  <NoAttributes {...args} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'No attributes were specified as filterable in the settings',
  btnTitle: 'Add filtrable attributes',
  btnHref: 'admin/settings/attributes',
}
