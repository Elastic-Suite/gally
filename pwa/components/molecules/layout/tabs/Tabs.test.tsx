import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import SubTabs from '~/components/atoms/subTabs/SubTabs'
import TertiaryButton from '~/components/atoms/buttons/TertiaryButton'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { renderWithProviders } from '~/services'

describe('TabsAndSubTabs', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <CustomTabs
        labels={['Scope', 'Searchable and filtrable attributes']}
        contents={[
          <SubTabs
            key="labels"
            labels={[
              'Catalogs',
              'Actives locales',
              'Actives locales 1',
              'Actives locales 2',
            ]}
            contents={[
              <TertiaryButton
                key="contents"
                size="medium"
                endIcon={
                  <IonIcon name="add-outline" style={{ fontSize: 24 }} />
                }
              >
                Button text
              </TertiaryButton>,
              'Hello World Deux',
              'Hello World Trois',
              'Hello World Quatre',
            ]}
          />,
          'Content of Searchable and filtrable attributes',
        ]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
