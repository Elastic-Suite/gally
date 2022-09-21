import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import { renderWithProviders } from '~/utils/tests'

describe('TabsAndSubTabs', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <CustomTabs
        tabs={[
          {
            label: 'Tab 1',
            Component: (): JSX.Element => <>Hello World 1</>,
            id: 0,
          },
          {
            label: 'Tab 2',
            Component: (): JSX.Element => <>Hello World 2</>,
            id: 1,
          },
          {
            label: 'Tab 3',
            Component: (): JSX.Element => <>Hello World 3</>,
            id: 2,
          },
          {
            label: 'Tab 4',
            Component: (): JSX.Element => <>Hello World 4</>,
            id: 3,
          },
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
