import PrimaryButton from './PrimaryButton'
import SecondaryButton from './SecondaryButton'
import TertiaryButton from './TertiaryButton'
import { renderWithProviders } from '~/services'

describe('PrimaryButton', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <PrimaryButton disabled={false} endIcon="" size="medium" startIcon="">
        Hello world
      </PrimaryButton>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('SecondaryButton', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <SecondaryButton disabled={false} endIcon="" size="medium" startIcon="">
        Hello world
      </SecondaryButton>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('TertiaryButton', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <TertiaryButton disabled={false} endIcon="" size="medium" startIcon="">
        Hello world
      </TertiaryButton>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('PrimaryButtonDisabledTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <PrimaryButton disabled endIcon="" size="medium" startIcon="">
        Hello world
      </PrimaryButton>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('SecondaryButtonDisabledTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <SecondaryButton disabled endIcon="" size="medium" startIcon="">
        Hello world
      </SecondaryButton>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('TertiaryButtonDisabledTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <TertiaryButton disabled endIcon="" size="medium" startIcon="">
        Hello world
      </TertiaryButton>
    )
    expect(container).toMatchSnapshot()
  })
})
