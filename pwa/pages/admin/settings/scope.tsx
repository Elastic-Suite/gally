import { Title } from '~/components/atoms/title/Title'
import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import SubTabs from '~/components/atoms/subTabs/SubTabs'
import ActiveLocales from '~/components/molecules/layout/scope/ActiveLocales'
import Catalogs from '~/components/molecules/layout/scope/Catalogs'
import { ICatalog, IHydraResponse } from '~/types'
import { useApiFetch } from '~/hooks'
import { firstLetterUppercase } from '~/services'
import { useTranslation } from 'next-i18next'

function Scope(): JSX.Element | string {
  const [catalogsFields] = useApiFetch<IHydraResponse<ICatalog>>('/catalogs')
  const { t } = useTranslation('common')

  if (catalogsFields.error) {
    return catalogsFields.error.toString()
  } else if (!catalogsFields.data) {
    return null
  }

  return (
    <>
      <Title name={firstLetterUppercase(t('catalog_one'))} />
      <CustomTabs
        labels={[t('scope'), t('searchableAndFiltrableAttributes')]}
        contents={[
          <SubTabs
            key="labels"
            labels={[
              firstLetterUppercase(t('catalog_other')),
              firstLetterUppercase(t('activeLocale_other')),
            ]}
            contents={[
              <Catalogs key="Catalogs" content={catalogsFields.data} />,
              <ActiveLocales
                key="ActiveLocales"
                content={catalogsFields.data}
              />,
            ]}
          />,
          t('contentOfSearchableAndFiltrableAttributes'),
        ]}
      />
    </>
  )
}

export default Scope
