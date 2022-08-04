import { ComponentMeta, ComponentStory } from '@storybook/react'
import SubTabs from './SubTabs'
import PrimaryButton from '../buttons/PrimaryButton'
import PopIn from '../modals/PopIn'

const data = [
  {
    id: 0,
    label: 'Hello One',
    Component: (): JSX.Element => (
      <PopIn
        title={<PrimaryButton>Hello One</PrimaryButton>}
        cancelName="Cancel"
        confirmName="Confirm"
        titlePopIn="Hello One"
      />
    ),
  },
  {
    id: 1,
    label: 'Hello Two',
    Component: (): JSX.Element => (
      <PopIn
        title={<PrimaryButton>Hello Two</PrimaryButton>}
        cancelName="Cancel"
        confirmName="Confirm"
        titlePopIn="Hello Two"
      />
    ),
  },
]

export default {
  title: 'Atoms/SubTabs',
  component: SubTabs,
} as ComponentMeta<typeof SubTabs>

const Template: ComponentStory<typeof SubTabs> = (): JSX.Element => {
  return <SubTabs defaultActiveId={1} tabs={data} />
}

export const SubsTabs = Template.bind({})
SubsTabs.args = {}
