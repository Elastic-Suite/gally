import { IRouterTab, ITabContentProps } from '~/types'
import { renderWithProviders } from '~/utils/tests'

import PrimaryButton from '../buttons/PrimaryButton'

import SubTabs from './SubTabs'

interface IProps extends ITabContentProps {
  title: string
}

function SubTabContent({ title }: IProps): JSX.Element {
  return <PrimaryButton>{title}</PrimaryButton>
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

describe('SubTabs match snapshot', () => {
  it('SubTabs defaultActive 0', () => {
    const { container } = renderWithProviders(
      <SubTabs defaultActiveId={0} tabs={data} />
    )
    expect(container).toMatchSnapshot()
  })

  it('SubTabs defaultActive 1', () => {
    const { container } = renderWithProviders(
      <SubTabs defaultActiveId={1} tabs={data} />
    )
    expect(container).toMatchSnapshot()
  })
})
