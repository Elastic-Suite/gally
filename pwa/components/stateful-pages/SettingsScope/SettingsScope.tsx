import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { useApiList, useResource, useTabs } from '~/hooks'
import { ICatalog, IHydraResponse, IRouterTab } from '~/types'

import SubTabs from '~/components/atoms/subTabs/SubTabs'
import Catalogs from '~/components/molecules/layout/scope/Catalogs'
import ActiveLocales from '~/components/molecules/layout/scope/ActiveLocales'

function SettingsScope(): JSX.Element {
  const { t } = useTranslation('catalog')
  const resourceName = 'Catalog'
  const resource = useResource(resourceName)
  const [catalogsFields] = useApiList<IHydraResponse<ICatalog>>(resource, false)

  const routerTabs: IRouterTab[] = useMemo(
    () => [
      {
        Component: Catalogs,
        componentProps: { content: catalogsFields.data },
        default: true,
        id: 0,
        label: t('title.catalogs'),
        url: '/admin/settings/scope/catalogs',
      },
      {
        Component: ActiveLocales,
        componentProps: { content: catalogsFields.data },
        id: 1,
        label: t('title.activeLocales'),
        url: '/admin/settings/scope/activeLocales',
      },
    ],
    [catalogsFields.data, t]
  )
  const [activeTab, handleTabChange] = useTabs(routerTabs)
  const { id } = activeTab

  if (catalogsFields.error) {
    // eslint-disable-next-line no-console
    console.error(catalogsFields.error)
    return <pre>{JSON.stringify(catalogsFields.error, null, 2)}</pre>
  } else if (!catalogsFields.data) {
    return null
  }

  return (
    <SubTabs
      defaultActiveId={id}
      onChange={handleTabChange}
      tabs={routerTabs}
    />
  )
}

export default SettingsScope
