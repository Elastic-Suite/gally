import { ComponentMeta, ComponentStory } from '@storybook/react'

import PrimaryButton from '../buttons/PrimaryButton'

import PageTitle from './PageTitle'

export default {
  title: 'Atoms/PageTitle',
  component: PageTitle,
} as ComponentMeta<typeof PageTitle>

const Template: ComponentStory<typeof PageTitle> = (args) => (
  <PageTitle {...args} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'Page title',
}

export const WithButtons = Template.bind({})
Default.args = {
  children: <PrimaryButton>Import (xlsx)</PrimaryButton>,
  title: 'Page title',
}
