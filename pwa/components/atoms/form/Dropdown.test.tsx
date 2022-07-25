import DropDown from './DropDown'
import { renderWithProviders } from '~/services'

describe('BadgeDisabledFalse', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <DropDown
        disabled={false}
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Fourty', value: 40, disabled: true },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('BadgeDisabledTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <DropDown
        disabled
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Fourty', value: 40 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('BadgeLabel', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <DropDown
        label="Label"
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Fourty', value: 40 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('BadgeRequiredFalse', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <DropDown
        required={false}
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Fourty', value: 40 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('BadgeRequiredTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <DropDown
        required
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Fourty', value: 40 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('BadgeMultiple', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <DropDown
        onChange={(): void => console.log('Hello world')}
        value={[]}
        multiple
        disabled={false}
        label="Label"
        options={[
          { label: 'Ten', value: 10 },
          { label: 'Twenty', value: 20 },
          { label: 'Thirty', value: 30 },
          { label: 'Fourty', value: 40 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
