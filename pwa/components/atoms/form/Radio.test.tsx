import { FormControlLabel, Radio } from '@mui/material'
import { renderWithProviders } from '~/services'

describe('Switch match snapshot', () => {
  it('Radio label Hello and disabled', () => {
    const { container } = renderWithProviders(
      <FormControlLabel
        disabled
        label="Hello"
        control={<Radio defaultChecked />}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('Radio label Hello and disabled false', () => {
    const { container } = renderWithProviders(
      <FormControlLabel
        disabled={false}
        label="Hello"
        control={<Radio defaultChecked />}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('Radio defaultChecked false', () => {
    const { container } = renderWithProviders(
      <FormControlLabel
        disabled={false}
        label="Hello"
        control={<Radio defaultChecked={false} />}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('FormControlLabel value male', () => {
    const { container } = renderWithProviders(
      <FormControlLabel
        value="male"
        disabled={false}
        label="Hello"
        control={<Radio defaultChecked={false} />}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('FormControlLabel value female', () => {
    const { container } = renderWithProviders(
      <FormControlLabel
        value="female"
        disabled={false}
        label="Hello"
        control={<Radio defaultChecked={false} />}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
