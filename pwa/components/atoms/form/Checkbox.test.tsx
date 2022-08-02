import { renderWithProviders } from '~/utils/tests'

import Checkbox from './Checkbox'

describe('Checkbox match snapshot', () => {
  it('CheckboxIndeterminateFalse', () => {
    const { container } = renderWithProviders(
      <Checkbox indeterminate={false} />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxIndeterminateTrue', () => {
    const { container } = renderWithProviders(<Checkbox indeterminate />)
    expect(container).toMatchSnapshot()
  })

  it('CheckboxLabelAndList', () => {
    const { container } = renderWithProviders(
      <Checkbox indeterminate label="Label" list />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxLabel', () => {
    const { container } = renderWithProviders(
      <Checkbox indeterminate={false} label="Label" />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxListTrue', () => {
    const { container } = renderWithProviders(
      <Checkbox indeterminate={false} list />
    )
    expect(container).toMatchSnapshot()
  })

  it('CheckboxListFalse', () => {
    const { container } = renderWithProviders(
      <Checkbox indeterminate={false} list={false} />
    )
    expect(container).toMatchSnapshot()
  })
})
