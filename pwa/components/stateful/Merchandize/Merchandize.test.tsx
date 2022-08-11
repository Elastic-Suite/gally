import Merchandize from './Merchandize'
import { renderWithProviders } from '~/utils/tests'

describe('Merchandize match snapshot', () => {
  it('testSelect', () => {
    const first = true
    const sec = true
    const val = 10

    const { container } = renderWithProviders(
      <Merchandize
        virtualCategoryValue={first}
        categoryNameValue={sec}
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
        {...{ value: val }}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
