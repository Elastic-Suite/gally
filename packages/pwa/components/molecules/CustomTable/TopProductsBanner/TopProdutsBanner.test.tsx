import { renderWithProviders } from '~/utils/tests'
import TopProductsBanner from './TopProductsBanner'

describe('TopProductsBanner', () => {
  it('Should match snapschot', () => {
    const { container } = renderWithProviders(
      <TopProductsBanner bannerText="hello" />
    )
    expect(container).toMatchSnapshot()
  })
})
