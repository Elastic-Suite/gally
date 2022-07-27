import SubTabs from '~/components/atoms/subTabs/SubTabs'
import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import { renderWithProviders } from '~/services'
import { ITab } from '~/types/tabs'

describe('TabsAndSubTabs', () => {
  it('match snapshot', () => {
    const tabsSubTabs: ITab[] = [
      {
        id: 1,
        content: 'test',
        label: 'Scope',
      },
    ]

    const tabsCustomTabs: ITab[] = [
      {
        id: 1,
        content: <SubTabs defaultActiveId={1} tabs={tabsSubTabs} />,
        label: 'Scope',
      },
    ]

    const { container } = renderWithProviders(
      <CustomTabs tabs={tabsCustomTabs} />
    )
    expect(container).toMatchSnapshot()
  })
})
