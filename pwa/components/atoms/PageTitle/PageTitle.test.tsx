import PageTitle from './PageTitle'
import { renderWithProviders } from '~/services'
import PrimaryButton from '../buttons/PrimaryButton'

describe('PageTitle', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<PageTitle title="Hello World" />)
    expect(container).toMatchSnapshot()
  })
})

describe('PageTitleH2', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <PageTitle title="Hello World" variant="h2" />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('PageTitleH3WithChildren', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <PageTitle title="Hello World" variant="h3">
        <PrimaryButton>Import (xlsx)</PrimaryButton>
      </PageTitle>
    )
    expect(container).toMatchSnapshot()
  })
})
