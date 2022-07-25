import { ComponentMeta, ComponentStory } from '@storybook/react'
import Tree from './Tree'
import categories from '../../../public/mocks/categories.json'

export default {
  title: 'Atoms/Tree',
  component: Tree,
} as ComponentMeta<typeof Tree>

const Template: ComponentStory<typeof Tree> = (args) => <Tree {...args} />

export const Default = Template.bind({})
Default.args = {
  data: categories.data.categoryTrees,
}
