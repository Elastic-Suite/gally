import { renderWithProviders } from '~/utils/tests'

import MassiveSelection from './MassiveSelection'

describe('MassiveSelection', () => {
  it('should match snapshot without indeterminate state', () => {
    const { container } = renderWithProviders(
      <MassiveSelection
        onSelection={null}
        selectionState
        indeterminateState={false}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should match snapshot with indeterminate state', () => {
    const { container } = renderWithProviders(
      <MassiveSelection onSelection={null} selectionState indeterminateState />
    )
    expect(container).toMatchSnapshot()
  })
})
