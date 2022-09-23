import { renderWithProviders } from '~/utils/tests'
import NoAttributes from './NoAttributes'

describe('NoAttributes', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <NoAttributes
        title="No attributes were specified as searchable in the settings"
        btnTitle="Add searchable attributes"
        btnHref="admin/settings/attributes"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
