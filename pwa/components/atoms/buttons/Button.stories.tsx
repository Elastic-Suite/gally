import { ComponentMeta } from '@storybook/react'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { icons } from '~/constants'

import ButtonsPreview from './ButtonsPreview'
import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import TertiaryButton from './TertiaryButton'

export default {
  title: 'Atoms/Buttons',
  component: PrimaryButton,
  argTypes: {
    Component: { table: { disable: true } },
    controls: { table: { disable: true } },
    endIcon: {
      options: [''].concat(icons),
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
} as ComponentMeta<typeof PrimaryButton>

const Template = ({
  Component,
  children,
  icon,
  endIcon,
  startIcon,
  ...props
}) => (
  <Component
    {...props}
    endIcon={endIcon && <IonIcon name={endIcon} style={{ fontSize: 24 }} />}
    startIcon={
      startIcon && <IonIcon name={startIcon} style={{ fontSize: 24 }} />
    }
  >
    {icon ? <IonIcon name={icon} style={{ fontSize: 24 }} /> : children}
  </Component>
)

export const Primary = Template.bind({})
Primary.args = {
  Component: PrimaryButton,
  children: 'Label',
  disabled: false,
  endIcon: '',
  icon: '',
  size: 'medium',
  startIcon: '',
}

export const Secondary = Template.bind({})
Secondary.args = {
  Component: SecondaryButton,
  children: 'Label',
  disabled: false,
  endIcon: '',
  icon: '',
  size: 'medium',
  startIcon: '',
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  Component: TertiaryButton,
  children: 'Label',
  disabled: false,
  endIcon: '',
  icon: '',
  size: 'medium',
  startIcon: '',
}

export const Preview = (args) => <ButtonsPreview {...args} />
Preview.args = {
  controls: { hideNoControlsWarning: true },
}
