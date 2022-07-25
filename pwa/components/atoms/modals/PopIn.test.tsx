import PopIn from './PopIn'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import { renderWithProviders } from '~/services'

describe('PopIn', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <PopIn
        title={<PrimaryButton size="large">Click on me !</PrimaryButton>}
        cancelName="Cancel"
        confirmName="Confirm"
        titlePopIn="Hello World"
        onConfirm={(): void => console.log('Hello World')}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
