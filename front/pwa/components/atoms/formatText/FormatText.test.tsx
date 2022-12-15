import { renderWithProviders } from '~/utils/tests'
import FormatText from './FormatText'

describe('FormatText match snapshot', () => {
  it('no tooltip with uppercase and max 20', () => {
    const { container } = renderWithProviders(
      <FormatText
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
      <FormatText
        name="tooltip with no uppercase and max 20"
        toolTip
        max={20}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('tooltip with uppercase and max default', () => {
    const { container } = renderWithProviders(
      <FormatText
        name="tooltip with uppercase and max default"
        toolTip
        firstLetterUpp
      />
    )
    expect(container).toMatchSnapshot()
  })
})
