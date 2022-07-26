import { useTranslation } from 'next-i18next'

import { useApiList, useResource } from '~/hooks'
import { firstLetterUppercase } from '~/services'
import { ICatalog, IHydraResponse } from '~/types'

import SubTabs from '~/components/atoms/subTabs/SubTabs'
import Catalogs from '~/components/molecules/layout/scope/Catalogs'
import ActiveLocales from '~/components/molecules/layout/scope/ActiveLocales'

function SettingsCatalog(): JSX.Element {
  const resourceName = 'catalogs'
  const resource = useResource(resourceName)
  const [catalogsFields] = useApiList<IHydraResponse<ICatalog>>(resource, false)
  const { t } = useTranslation('catalog')

  if (catalogsFields.error) {
    return <>{catalogsFields.error.toString()}</>
  } else if (!catalogsFields.data) {
    return null
  }

  return (
    <SubTabs
      key="labels"
      labels={[
        firstLetterUppercase(t('catalog_other')),
        firstLetterUppercase(t('activeLocale_other')),
      ]}
      contents={[
        <Catalogs key="Catalogs" content={catalogsFields.data} />,
        <ActiveLocales key="ActiveLocales" content={catalogsFields.data} />,
      ]}
    />
  )

  // return <Catalogs key="Catalogs" content={catalogsFields.data} />
}

export default SettingsCatalog
