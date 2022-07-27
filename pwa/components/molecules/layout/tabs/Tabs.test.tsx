import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import { renderWithProviders } from '~/services'

describe('TabsAndSubTabs', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <CustomTabs
        tabs={[
          { label: 'Tab 1', content: 'Hello World 1', id: 0 },
          { label: 'Tab 2', content: 'Hello World 2', id: 1 },
          { label: 'Tab 3', content: 'Hello World 3', id: 2 },
          { label: 'Tab 4', content: 'Hello World 4', id: 3 },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
