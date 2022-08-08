import SwitchComp from './SwitchComp'
import { renderWithProviders } from '~/utils/tests'
import { ChangeEvent } from 'react'

describe('SwitchComp match snapshot', () => {
  it('testSwitchTrue', () => {
    let first = true
    const setFirst = (bol: boolean): void => {
      first = bol
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      setFirst(event.target.checked)
    }
    const { container } = renderWithProviders(
      <SwitchComp
        label="label"
        labelInfo="labelInfo"
        handleChange={handleChange}
        value={first}
        name="checkedA"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
