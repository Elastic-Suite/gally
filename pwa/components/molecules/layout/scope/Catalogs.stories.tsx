import { ComponentMeta, ComponentStory } from '@storybook/react'
import Catalogs from '~/components/molecules/layout/scope/Catalogs'

const ObjectCalogs = [
  {
    name: 'Belgique Website',
    nbActiveLocales: 12,
    language: [
      'hello world fr',
      'English',
      'Us',
      'English',
      'french',
      'French',
      'French',
    ],
  },
  {
    name: 'France website',
    nbActiveLocales: 3,
    language: [
      'TEST',
      'English',
      'Us',
      'English',
      'french',
      'French',
      'French',
    ],
  },
  {
    name: 'Swiss website',
    nbActiveLocales: 12,
    language: [
      'aa',
      'English',
      'Us',
      'EnglisAh',
      'frenAAAch',
      'FreAnch',
      'FreAAAnch',
    ],
  },
  {
    name: 'Germany website',
    nbActiveLocales: 6,
    language: [
      'English',
      'English',
      'Us',
      'English',
      'french',
      'French',
      'French',
    ],
  },
  {
    name: 'Italy website',
    nbActiveLocales: 0,
    language: [
      'Spanish',
      'English',
      'Us',
      'English',
      'french',
      'French',
      'French',
    ],
  },
]

export default {
  title: 'Molecules/Scopes',
  component: Catalogs,
} as ComponentMeta<typeof Catalogs>

const Template: ComponentStory<typeof Catalogs> = (args) => (
  <Catalogs {...args} />
)

export const Catalog = Template.bind({})
Catalog.args = {
  content: ObjectCalogs,
}
