import { ComponentMeta } from '@storybook/react'
import { ButtonProps } from '@mui/material'

import { icons } from '../IonIcon/icons'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import Button from './Button'

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    Component: { table: { disable: true } },
    controls: { table: { disable: true } },
    endIcon: {
      options: [''].concat(icons),
      control: { type: 'select' },
    },
    display: {
      options: ['primary', 'secondary', 'tertiary'],
      control: { type: 'select' },
    },
    icon: {
      options: [''].concat(icons),
      control: { type: 'select' },
      description: 'override the "children" props in this story',
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
    startIcon: {
      options: [''].concat(icons),
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof Button>

interface IProps extends ButtonProps {
  endIcon: string
  icon: string
  startIcon: string
}

function Template(args: IProps): JSX.Element {
  const { children, icon, endIcon, startIcon, ...props } = args
  return (
    <Button
      {...props}
      endIcon={
        endIcon ? <IonIcon name={endIcon} style={{ fontSize: 24 }} /> : null
      }
      startIcon={
        startIcon ? <IonIcon name={startIcon} style={{ fontSize: 24 }} /> : null
      }
    >
      {icon ? <IonIcon name={icon} style={{ fontSize: 24 }} /> : children}
    </Button>
  )
}

export const Default = Template.bind({})
Default.args = {
  children: 'Label',
  disabled: false,
  display: 'primary',
  endIcon: '',
  icon: '',
  loading: false,
  size: 'medium',
  startIcon: '',
}

export const WithOptions = Template.bind({})
WithOptions.args = {
  children: 'Label',
  disabled: false,
  display: 'primary',
  endIcon: '',
  icon: '',
  loading: false,
  size: 'medium',
  startIcon: '',
  options: [
    { value: 1, label: 'Item 1' },
    { value: 2, label: 'Item 2' },
  ],
}
