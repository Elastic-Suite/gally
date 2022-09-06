import { renderWithProviders } from '~/utils/tests'

import Button from '../buttons/Button'

import PageTitle from './PageTitle'

describe('PageTitle match snapshot', () => {
  it('PageTitle simple', () => {
    const { container } = renderWithProviders(<PageTitle title="Hello World" />)
    expect(container).toMatchSnapshot()
  })

  it('PageTitleH2', () => {
    const { container } = renderWithProviders(
      <PageTitle title="Hello World" variant="h2" />
    )
    expect(container).toMatchSnapshot()
  })

  it('PageTitleH3WithChildren', () => {
    const { container } = renderWithProviders(
      <PageTitle title="Hello World" variant="h3">
        <Button>Import (xlsx)</Button>
      </PageTitle>
    )
    expect(container).toMatchSnapshot()
  })
})
