import { ComponentMeta, ComponentStory } from '@storybook/react'
import Categories from './Categories'
import categories from '../../../public/mocks/categories.json'

export default {
  title: 'Atoms/Categories',
  component: Categories,
} as ComponentMeta<typeof Categories>

const Template: ComponentStory<typeof Categories> = (args) => (
  <Categories {...args} />
)

export const Default = Template.bind({})
Default.args = {
  items: categories,
}
