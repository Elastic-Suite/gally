import { Title } from '~/components/atoms/title/Title'
import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import SubTabs from '~/components/atoms/subTabs/SubTabs'
import ActiveLocales from '~/components/molecules/layout/scope/ActiveLocales'
import Catalogs from '~/components/molecules/layout/scope/Catalogs'
import { IHydraResponse } from '~/types'
import { useApiFetch } from '~/hooks/useApi'

const Scope = () => {
  const [catalogsFields] = useApiFetch<IHydraResponse>('/catalogs')

  if (catalogsFields.error) {
    return catalogsFields.error.toString()
  } else if (!catalogsFields.data) {
    return null
  }

  return (
    <>
      <Title name="Catalog" />
      <CustomTabs
        labels={['Scope', 'Searchable and filtrable attributes']}
        contents={[
          <SubTabs
            key="labels"
            labels={['Catalogs', 'Actives locales']}
            contents={[
              <Catalogs content={catalogsFields.data} />,
              <ActiveLocales content={catalogsFields.data} />,
            ]}
          />,
          'Content of Searchable and filtrable attributes',
        ]}
      />
    </>
  )
}

export default Scope
