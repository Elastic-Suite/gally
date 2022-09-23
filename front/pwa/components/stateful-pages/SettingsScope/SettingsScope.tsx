import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import { useApiList, useResource, useTabs } from '~/hooks'
import { IHydraCatalog, IRouterTab } from 'shared'

import SubTabs from '~/components/atoms/subTabs/SubTabs'
import Catalogs from '~/components/molecules/layout/scope/Catalogs'
import ActiveLocales from '~/components/molecules/layout/scope/ActiveLocales'

function SettingsScope(): JSX.Element {
  const { t } = useTranslation('catalog')
  const resourceName = 'Catalog'
  const resource = useResource(resourceName)
  const [catalogsFields] = useApiList<IHydraCatalog>(resource, false)
  const { data, error } = catalogsFields

  const routerTabs: IRouterTab[] = useMemo(
    () => [
      {
        Component: Catalogs,
        componentProps: { content: data },
        default: true,
        id: 0,
        label: t('title.catalogs'),
        url: '/admin/settings/scope/catalogs',
      },
      {
        Component: ActiveLocales,
        componentProps: { content: data },
        id: 1,
        label: t('title.activeLocales'),
        url: '/admin/settings/scope/activeLocales',
      },
    ],
    [data, t]
  )
  const [activeTab, handleTabChange] = useTabs(routerTabs)
  const { id } = activeTab

  if (error || !data) {
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
