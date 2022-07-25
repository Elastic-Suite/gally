import Checkbox from './Checkbox'
import { renderWithProviders } from '~/services'

describe('CheckboxIndeterminateFalse', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Checkbox indeterminate={false} />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('CheckboxIndeterminateTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<Checkbox indeterminate />)
    expect(container).toMatchSnapshot()
  })
})

describe('CheckboxLabelAndList', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Checkbox indeterminate label="Label" list />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('CheckboxLabel', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Checkbox indeterminate={false} label="Label" />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('CheckboxListTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Checkbox indeterminate={false} list />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('CheckboxListFalse', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Checkbox indeterminate={false} list={false} />
    )
    expect(container).toMatchSnapshot()
  })
})
