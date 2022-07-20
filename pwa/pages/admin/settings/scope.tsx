import { Title } from '~/components/atoms/title/Title'
import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import SubTabs from '~/components/atoms/subTabs/SubTabs'
import ActiveLocales from '~/components/molecules/layout/scope/ActiveLocales'
import Catalogs from '~/components/molecules/layout/scope/Catalogs'
import { IHydraResponse } from '~/types'
import { useApiFetch } from '~/hooks/useApi'
import { firstLetterUppercase } from '~/services/format'
import { useTranslation } from 'next-i18next'

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
              <Catalogs key={'Catalogs'} content={catalogsFields.data} />,
              <ActiveLocales
                key={'ActiveLocales'}
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
