import { renderWithProviders } from '~/utils/tests'
import NoAttributes from './NoAttributes'

describe('NoAttributes', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <NoAttributes
        title="No attributes were specified as filterable in the settings"
        btnTitle="Add filtrable attributes"
        btnHref="admin/settings/attributes"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
