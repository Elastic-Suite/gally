import InfoTooltip from './InfoTooltip'
import { renderWithProviders } from '~/utils/tests'

describe('InfoTooltip match snapshot', () => {
  it('testInfoText', () => {
    const { container } = renderWithProviders(<InfoTooltip text="salut" />)
    expect(container).toMatchSnapshot()
  })
})
