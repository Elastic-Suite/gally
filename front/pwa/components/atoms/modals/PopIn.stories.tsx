import { ComponentMeta, ComponentStory } from '@storybook/react'

import Button from '~/components/atoms/buttons/Button'

import PopIn from './PopIn'

export default {
  title: 'Atoms/Modals',
  component: PopIn,
} as ComponentMeta<typeof PopIn>

const Template: ComponentStory<typeof PopIn> = (args) => <PopIn {...args} />

export const Pop_In = Template.bind({})
Pop_In.args = {
  title: <Button size="large">Click on me !</Button>,
  cancelName: 'Cancel',
  confirmName: 'Confirm',
  titlePopIn: 'Hello World',
}
