import InfoTooltip from './InfoTooltip'
import { renderWithProviders } from '~/services'

describe('InfoTooltip match snapshot', () => {
  it('testInfoText', () => {
    const { container } = renderWithProviders(<InfoTooltip text="salut" />)
    expect(container).toMatchSnapshot()
  })
})
