import InputText from './InputText'
import { renderWithProviders } from '~/services'

describe('BadgeDisabledFalse', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <InputText
        id="input-text"
        label="Label"
        placeholder="Name"
        required={false}
        disabled={false}
        helperText=""
        helperIcon=""
        color="primary"
        endAdornment={null}
        value="hello world"
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('BadgeDisabledFalseRequired&disabledTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <InputText
        id="input-text"
        label="Label"
        placeholder="Name"
        required
        disabled
        helperText=""
        helperIcon=""
        color="primary"
        endAdornment={null}
        value="hello world"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
