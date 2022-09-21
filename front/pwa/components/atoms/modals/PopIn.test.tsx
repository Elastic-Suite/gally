import { renderWithProviders } from '~/utils/tests'

import Button from '~/components/atoms/buttons/Button'

import PopIn from './PopIn'

describe('PopIn match snapshot', () => {
  it('PopIn simple', () => {
    const { container } = renderWithProviders(
      <PopIn
        title={<Button size="large">Click on me !</Button>}
        cancelName="Cancel"
        confirmName="Confirm"
        titlePopIn="Hello World"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
