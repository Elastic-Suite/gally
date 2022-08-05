import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import { renderWithProviders } from '~/utils/tests'

import PopIn from './PopIn'

describe('PopIn match snapshot', () => {
  it('PopIn simple', () => {
    const { container } = renderWithProviders(
      <PopIn
        title={<PrimaryButton size="large">Click on me !</PrimaryButton>}
        cancelName="Cancel"
        confirmName="Confirm"
        titlePopIn="Hello World"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
