import { renderWithProviders } from '~/utils/tests'

import InputText from './InputText'

describe('InputText match snapshot', () => {
  it('BadgeDisabledFalse', () => {
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

  it('BadgeDisabledFalseRequired', () => {
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
