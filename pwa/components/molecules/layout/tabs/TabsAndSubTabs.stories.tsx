import { ComponentMeta, ComponentStory } from '@storybook/react'
import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'

export default {
  title: 'Molecules/TabsAndSubTabs',
  component: CustomTabs,
} as ComponentMeta<typeof CustomTabs>

const Template: ComponentStory<typeof CustomTabs> = (args) => (
  <CustomTabs {...args} />
)

export const Default = Template.bind({})
Default.args = {
  tabs: [
    { label: 'Tab 1', content: 'Hello World 1', id: 0 },
    { label: 'Tab 2', content: 'Hello World 2', id: 1 },
    { label: 'Tab 3', content: 'Hello World 3', id: 2 },
    { label: 'Tab 4', content: 'Hello World 4', id: 3 },
  ],
}
