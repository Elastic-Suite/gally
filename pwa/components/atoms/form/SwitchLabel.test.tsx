import { renderWithProviders } from '~/utils/tests'
import SwitchLabel from './SwitchLabel'

describe('SwitchLabel match snapshot', () => {
  it('testSwitchTrue', () => {
    const first = true

    const { container } = renderWithProviders(
      <SwitchLabel
        label="label"
        labelInfo="labelInfo"
        checked={first}
        name="checkedA"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
