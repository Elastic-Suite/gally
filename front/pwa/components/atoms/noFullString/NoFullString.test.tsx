import { renderWithProviders } from '~/utils/tests'
import NoFullString from './NoFullString'

describe('NoFullString match snapshot', () => {
  it('no tooltip with uppercase and max 20', () => {
    const { container } = renderWithProviders(
      <NoFullString
        name="no tooltip with uppercase and max 20"
        toolTip={false}
        max={20}
        firstLetterUpp
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('tooltip with no uppercase and max 20', () => {
    const { container } = renderWithProviders(
      <NoFullString
        name="tooltip with no uppercase and max 20"
        toolTip
        max={20}
        firstLetterUpp={false}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('tooltip with uppercase and max default', () => {
    const { container } = renderWithProviders(
      <NoFullString
        name="tooltip with uppercase and max default"
        toolTip
        firstLetterUpp
      />
    )
    expect(container).toMatchSnapshot()
  })
})
