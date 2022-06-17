import { Title } from '~/components/atoms/title/Title'
import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import SubTabs from '~/components/atoms/subTabs/SubTabs'

const Catalog = () => {
  return (
    <div style={{ width: '100%' }}>
      <Title name="Catalog" />
      <CustomTabs
        labels={['Scope', 'Searchable and filtrable attributes']}
        contents={[
          <SubTabs
            labels={[
              'Catalogs',
              'Actives locales',
              'Actives locales 1',
              'Actives locales 2',
            ]}
            contents={[
              'Hello World Un',
              'Hello World Deux',
              'Hello World Trois',
              'Hello World Quatre',
            ]}
          />,
          'Content of Searchable and filtrable attributes',
        ]}
      />
    </div>
  )
}

export default Catalog
