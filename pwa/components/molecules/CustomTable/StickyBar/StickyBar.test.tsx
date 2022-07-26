import { renderWithProviders } from '~/services/tests'
import StickyBar from './StickyBar'

describe('StickyBar', () => {
  it('should match snapshot', () => {
    const { container } = renderWithProviders(
      <StickyBar
        show
        onMassiveSelection={null}
        massiveSelectionState
        massiveSelectionIndeterminate
      />
    )
    expect(container).toMatchSnapshot()
  })
})
