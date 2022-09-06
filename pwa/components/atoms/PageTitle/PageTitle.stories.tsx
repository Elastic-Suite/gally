import { ComponentMeta, ComponentStory } from '@storybook/react'

import Button from '../buttons/Button'

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
WithButtons.args = {
  children: <Button>Import (xlsx)</Button>,
  title: 'Page title',
}
