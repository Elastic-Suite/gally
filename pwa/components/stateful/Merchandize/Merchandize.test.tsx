import Merchandize from './Merchandize'
import { renderWithProviders } from '~/services'

describe('Merchandize match snapshot', () => {
  it('BadgeDisabledFalse', () => {
    let first = true
    const setFirst = (bol: boolean): void => {
      first = bol
    }
    let sec = true
    const setSec = (bol: boolean): void => {
      sec = bol
    }
    const setValue = (str: string): string => {
      return str
    }

    const handleChange = (value: string): string => setValue(value)

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
        {...{ onChange: handleChange }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
