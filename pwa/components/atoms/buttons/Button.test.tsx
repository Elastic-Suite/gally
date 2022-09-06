import { renderWithProviders } from '~/utils/tests'

import Button from './Button'

describe('Button match snapshot', () => {
  it('PrimaryButton', () => {
    const { container } = renderWithProviders(
      <Button disabled={false} endIcon="" size="medium" startIcon="">
        Hello world
      </Button>
    )
    expect(container).toMatchSnapshot()
  })

  it('SecondaryButton', () => {
    const { container } = renderWithProviders(
      <Button
        display="secondary"
        disabled={false}
        endIcon=""
        size="medium"
        startIcon=""
      >
        Hello world
      </Button>
    )
    expect(container).toMatchSnapshot()
  })

  it('TertiaryButton', () => {
    const { container } = renderWithProviders(
      <Button
        display="tertiary"
        disabled={false}
        endIcon=""
        size="medium"
        startIcon=""
      >
        Hello world
      </Button>
    )
    expect(container).toMatchSnapshot()
  })

  it('PrimaryButtonDisabledTrue', () => {
    const { container } = renderWithProviders(
      <Button disabled endIcon="" size="medium" startIcon="">
        Hello world
      </Button>
    )
    expect(container).toMatchSnapshot()
  })

  it('SecondaryButtonDisabledTrue', () => {
    const { container } = renderWithProviders(
      <Button
        display="secondary"
        disabled
        endIcon=""
        size="medium"
        startIcon=""
      >
        Hello world
      </Button>
    )
    expect(container).toMatchSnapshot()
  })

  it('TertiaryButtonDisabledTrue', () => {
    const { container } = renderWithProviders(
      <Button display="tertiary" disabled endIcon="" size="medium" startIcon="">
        Hello world
      </Button>
    )
    expect(container).toMatchSnapshot()
  })
})
