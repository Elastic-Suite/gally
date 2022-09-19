import { ComponentMeta, ComponentStory } from '@storybook/react'

import { IRouterTab, ITabContentProps } from 'shared'

import Button from '../buttons/Button'

import SubTabs from './SubTabs'

interface IProps extends ITabContentProps {
  title: string
}

function SubTabContent({ title }: IProps): JSX.Element {
  return <Button>{title}</Button>
}

const data: IRouterTab[] = [
  {
    id: 0,
    label: 'Hello One',
    Component: SubTabContent,
    componentProps: {
      title: 'Hello One',
    },
    url: '/test1',
  },
  {
    id: 1,
    label: 'Hello Two',
    Component: SubTabContent,
    componentProps: {
      title: 'Hello Two',
    },
    url: '/test2',
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
