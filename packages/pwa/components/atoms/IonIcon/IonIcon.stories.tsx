import { ComponentMeta, ComponentStory } from '@storybook/react'

import { icons } from './icons'
import IonIcon from './IonIcon'

export default {
  title: 'Atoms/IonIcon',
  component: IonIcon,
  argTypes: {
    name: {
      options: icons,
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof IonIcon>

const Template: ComponentStory<typeof IonIcon> = (args) => <IonIcon {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'analytics',
}
