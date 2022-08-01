import { renderWithProviders } from '~/services'
import RadioGroup from './RadioGroup'

describe('Switch match snapshot', () => {
  it('Radio group simple', () => {
    const { container } = renderWithProviders(
      <RadioGroup
        name="radio-buttons-group"
        defaultChecked="female"
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
