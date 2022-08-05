import { renderWithProviders } from '~/utils/tests'

import CloseComponent from './CloseComponent'

describe('CloseComponent match snapshot', () => {
  it('CloseComponent simple', () => {
    const { container } = renderWithProviders(
      <CloseComponent
        onClose={(): void => {
          Math.floor(1)
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
