import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import PopIn from './PopIn'

export default {
  title: 'Atoms/Modals',
  component: PopIn,
} as ComponentMeta<typeof PopIn>

const Template: ComponentStory<typeof PopIn> = (args) => <PopIn {...args} />

export const Pop_In = Template.bind({})
Pop_In.args = {
  title: 'Hello World',
  btnCancel: 'Cancel',
  btnConfirm: 'Confirm',
  onFunc: () => alert('My function ...'),
  onClose: () => alert('Pop In close'),
}
