import SwitchComp from './SwitchComp'
import { renderWithProviders } from '~/services'
import { ChangeEvent } from 'react'

describe('SwitchComp match snapshot', () => {
  it('BadgeDisabledFalse', () => {
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
