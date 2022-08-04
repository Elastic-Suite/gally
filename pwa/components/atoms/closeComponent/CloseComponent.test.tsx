import CloseComponent from './CloseComponent'
import { renderWithProviders } from '~/services'

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
