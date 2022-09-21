import InfoTooltip from './InfoTooltip'
import { renderWithProviders } from '~/utils/tests'

describe('InfoTooltip match snapshot', () => {
  it('testInfoTitle', () => {
    const { container } = renderWithProviders(<InfoTooltip title="salut" />)
    expect(container).toMatchSnapshot()
  })
})
