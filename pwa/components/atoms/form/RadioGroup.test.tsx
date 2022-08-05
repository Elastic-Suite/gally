import { renderWithProviders } from '~/utils/tests'

import RadioGroup from './RadioGroup'

describe('Switch match snapshot', () => {
  it('Radio group defaultChecked true with default', () => {
    const { container } = renderWithProviders(
      <RadioGroup
        name="radio-buttons-group"
        defaultChecked
        row
        options={[
          { value: 'male', label: 'Label One', disabled: true },
          { value: 'female', label: 'Label Two', default: true },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('Radio group defaultChecked true without default', () => {
    const { container } = renderWithProviders(
      <RadioGroup
        name="radio-buttons-group"
        defaultChecked
        row
        options={[
          { value: 'male', label: 'Label One', disabled: true },
          { value: 'female', label: 'Label Two' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('Radio group defaultChecked False with default true', () => {
    const { container } = renderWithProviders(
      <RadioGroup
        name="radio-buttons-group"
        defaultChecked={false}
        row
        options={[
          { value: 'male', label: 'Label One', disabled: true },
          { value: 'female', label: 'Label Two', default: true },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('Radio group defaultChecked False without default', () => {
    const { container } = renderWithProviders(
      <RadioGroup
        name="radio-buttons-group"
        defaultChecked={false}
        row
        options={[
          { value: 'male', label: 'Label One', disabled: true },
          { value: 'female', label: 'Label Two' },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
