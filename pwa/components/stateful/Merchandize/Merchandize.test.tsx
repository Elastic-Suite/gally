import Merchandize from './Merchandize'
import { renderWithProviders } from '~/services'

describe('Merchandize match snapshot', () => {
  it('testSelect', () => {
    let first = true
    const setFirst = (bol: boolean): void => {
      first = bol
    }
    let sec = true
    const setSec = (bol: boolean): void => {
      sec = bol
    }
    let val = 10
    const setValue = (str: number): void => {
      val = str
    }

    const handleChange = (value: number): void => setValue(value)

    const { container } = renderWithProviders(
      <Merchandize
        onVirtualCategoryChange={setFirst}
        virtualCategoryValue={first}
        onCategoryNameChange={setSec}
        useCategoryNameValue={sec}
        {...{
          args: {
            disabled: false,
            label: 'Label',
            options: [
              { label: 'Ten', value: 10 },
              { label: 'Twenty', value: 20 },
              { label: 'Thirty', value: 30 },
              { label: 'Fourty', value: 40 },
            ],
            required: false,
          },
        }}
        {...{ onChange: handleChange, value: val }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
