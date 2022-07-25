import { ComponentMeta, ComponentStory } from '@storybook/react'
import TooltipComponent from './Tooltip'

export default {
  title: 'Atoms/Modals',
  component: TooltipComponent,
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
} as ComponentMeta<typeof TooltipComponent>

const Template: ComponentStory<typeof TooltipComponent> = (args) => (
  <TooltipComponent {...args} />
)

export const ToolTip = Template.bind({})
ToolTip.args = {
  title: 'Hello World',
  children: <span>Hover me</span>,
}
