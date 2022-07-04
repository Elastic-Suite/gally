import { ComponentStory, ComponentMeta } from '@storybook/react'
import Tooltips from './Tooltip'

export default {
  title: 'Atoms/Modals',
  component: Tooltips,
  argTypes: {
    placement: {
      options: [
        'top-start',
        'top-end',
        'left-start',
        'left-start',
        'left',
        'left-end',
        'right-start',
        'right',
        'right-end',
        'bottom-start',
        'bottom',
        'bottom-end',
      ],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof Tooltips>

const Template: ComponentStory<typeof Tooltips> = (args) => (
  <Tooltips {...args} />
)

export const ToolTips = Template.bind({})
ToolTips.args = {
  hoverDesc: 'Hello World',
  placement: 'bottom',
  desc: 'Hover me',
}
