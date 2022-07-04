import { ComponentStory, ComponentMeta } from '@storybook/react'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import PopIn from './PopIn'

export default {
  title: 'Atoms/Modals',
  component: PopIn,
} as ComponentMeta<typeof PopIn>

const Template: ComponentStory<typeof PopIn> = (args) => <PopIn {...args} />

export const Pop_In = Template.bind({})
Pop_In.args = {
  title: <PrimaryButton size="large">Click on me !</PrimaryButton>,
  onConfirm: () => alert('salut'),
  cancelName: 'Cancel',
  confirmName: 'Confirm',
  titlePopIn: 'Hello World',
}
