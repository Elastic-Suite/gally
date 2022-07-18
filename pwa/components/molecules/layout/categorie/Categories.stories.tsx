import { ComponentMeta, ComponentStory } from '@storybook/react'
import Categorie from './Categorie'
import categories from '../../../../public/mocks/categories.json'

export default {
  title: 'Atoms/Categorie',
  component: Categorie,
} as ComponentMeta<typeof Categorie>

const Template: ComponentStory<typeof Categorie> = (args) => (
  <Categorie {...args} />
)

export const Default = Template.bind({})
Default.args = {
  data: categories,
}
