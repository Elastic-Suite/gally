import { ComponentMeta, ComponentStory } from '@storybook/react'

import menu from '../../../public/mocks/menu.json'
import BreadCrumbs from './BreadCrumbs'

export default {
  title: 'Atoms/BreadCrumb',
  component: BreadCrumbs,
} as ComponentMeta<typeof BreadCrumbs>

const Template: ComponentStory<typeof BreadCrumbs> = (args) => (
  <BreadCrumbs {...args} />
)

export const Default = Template.bind({})
Default.args = {
  slug: ['search', 'configuration', 'autocompletion'],
  menu,
}
