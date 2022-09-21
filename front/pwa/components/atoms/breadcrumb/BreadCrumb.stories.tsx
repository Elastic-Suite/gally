import { ComponentMeta, ComponentStory } from '@storybook/react'

import menu from '../../../public/mocks/menu.json'
import Breadcrumbs from './Breadcrumbs'

export default {
  title: 'Atoms/BreadCrumb',
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>

const Template: ComponentStory<typeof Breadcrumbs> = (args) => (
  <Breadcrumbs {...args} />
)

export const Default = Template.bind({})
Default.args = {
  slug: ['search', 'configuration', 'autocompletion'],
  menu,
}
