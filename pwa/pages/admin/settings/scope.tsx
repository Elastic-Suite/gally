import { Title } from '~/components/atoms/title/Title'
import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import SubTabs from '~/components/atoms/subTabs/SubTabs'
import ActiveLocales from '~/components/molecules/layout/scope/ActiveLocales'
import Catalogs from '~/components/molecules/layout/scope/Catalogs'
import { IHydraResponse } from '~/types'
import { useApiFetch } from '~/hooks/useApi'
import { useTranslation } from 'next-i18next'
import { firstLetterUppercase } from '~/services/format'

const Scope = () => {
  const [catalogsFields] = useApiFetch<IHydraResponse>('/catalogs')
  const { t } = useTranslation('common')
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
            labels={[
              firstLetterUppercase(t('catalog_other', { count: 2 })),
              firstLetterUppercase(t('activeLocale_other', { count: 2 })),
            ]}
            contents={[
              <Catalogs key="Catalogs" content={catalogsFields.data} />,
              <ActiveLocales
                key="ActiveLocales"
                content={catalogsFields.data}
              />,
            ]}
          />,
          'Content of Searchable and filtrable attributes',
        ]}
      />
    </>
  )
}

export default Scope
