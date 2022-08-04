import PopIn from './PopIn'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import { renderWithProviders } from '~/services'

describe('PopIn match snapshot', () => {
  it('PopIn simple', () => {
    const { container } = renderWithProviders(
      <PopIn
        title={<PrimaryButton size="large">Click on me !</PrimaryButton>}
        cancelName="Cancel"
        confirmName="Confirm"
        titlePopIn="Hello World"
        onConfirm={(): void => {
          Math.floor(1)
        }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
