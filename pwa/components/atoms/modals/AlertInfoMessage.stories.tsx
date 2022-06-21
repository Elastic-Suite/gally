import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import AlertInfoMessage from './AlertInfoMessage'

export default {
  title: 'Atoms/Modals',
  component: AlertInfoMessage,
  argTypes: {
    dev: {
      control: { type: 'boolean' },
    },
  },
} as ComponentMeta<typeof AlertInfoMessage>

const Template: ComponentStory<typeof AlertInfoMessage> = (args) => (
  <AlertInfoMessage {...args} />
)

export const AlertInfoMessages = Template.bind({})
AlertInfoMessages.args = {
  title: 'Hello World',
  dev: true,
}
