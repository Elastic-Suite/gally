import SubTabs from './SubTabs'
import { renderWithProviders } from '~/services'
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
