import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import TertiaryButton from './TertiaryButton'
import { renderWithProviders } from '~/services'

describe('Button match snapshot', () => {
  it('PrimaryButton', () => {
    const { container } = renderWithProviders(
      <PrimaryButton disabled={false} endIcon="" size="medium" startIcon="">
        Hello world
      </PrimaryButton>
    )
    expect(container).toMatchSnapshot()
  })

  it('SecondaryButton', () => {
    const { container } = renderWithProviders(
      <SecondaryButton disabled={false} endIcon="" size="medium" startIcon="">
        Hello world
      </SecondaryButton>
    )
    expect(container).toMatchSnapshot()
  })

  it('TertiaryButton', () => {
    const { container } = renderWithProviders(
      <TertiaryButton disabled={false} endIcon="" size="medium" startIcon="">
        Hello world
      </TertiaryButton>
    )
    expect(container).toMatchSnapshot()
  })

  it('PrimaryButtonDisabledTrue', () => {
    const { container } = renderWithProviders(
      <PrimaryButton disabled endIcon="" size="medium" startIcon="">
        Hello world
      </PrimaryButton>
    )
    expect(container).toMatchSnapshot()
  })

  it('SecondaryButtonDisabledTrue', () => {
    const { container } = renderWithProviders(
      <SecondaryButton disabled endIcon="" size="medium" startIcon="">
        Hello world
      </SecondaryButton>
    )
    expect(container).toMatchSnapshot()
  })

  it('TertiaryButtonDisabledTrue', () => {
    const { container } = renderWithProviders(
      <TertiaryButton disabled endIcon="" size="medium" startIcon="">
        Hello world
      </TertiaryButton>
    )
    expect(container).toMatchSnapshot()
  })
})
