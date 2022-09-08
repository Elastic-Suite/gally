import { renderWithProviders } from '~/utils/tests'
import Switch from './Switch'

describe('SwitchLabel match snapshot', () => {
  it('testSwitchTrue', () => {
    const first = true

    const { container } = renderWithProviders(
      <Switch
        label="label"
        labelInfo="labelInfo"
        checked={first}
        name="checkedA"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
