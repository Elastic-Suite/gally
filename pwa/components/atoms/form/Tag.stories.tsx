import { ComponentMeta, Story } from '@storybook/react'
import TagComponent, { IProps } from './Tag'

export default {
  title: 'Atoms/Form',
  component: TagComponent,
  argTypes: {
    color: {
      options: ['', 'neutral', 'secondary'],
      control: { type: 'select' },
    },
    showIcon: {
      description: 'Storybook props only.',
    },
  },
} as ComponentMeta<typeof TagComponent>

const Template: Story<IProps & { showIcon: boolean }> = ({
  showIcon,
  onIconClick,
  ...args
}) => <TagComponent {...args} onIconClick={showIcon ? onIconClick : null} />

export const Tag = Template.bind({})
Tag.args = {
  children: 'Text',
  color: '',
  showIcon: false,
}
