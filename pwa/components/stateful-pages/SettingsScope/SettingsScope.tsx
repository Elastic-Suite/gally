import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { useApiList, useResource } from '~/hooks'
import { firstLetterUppercase } from '~/services'
import { ICatalog, IHydraResponse, IRouterTab } from '~/types'

import SubTabs from '~/components/atoms/subTabs/SubTabs'
import Catalogs from '~/components/molecules/layout/scope/Catalogs'
import ActiveLocales from '~/components/molecules/layout/scope/ActiveLocales'

function SettingsScope(): JSX.Element {
  const resourceName = 'catalogs'
  const resource = useResource(resourceName)
  const [catalogsFields] = useApiList<IHydraResponse<ICatalog>>(resource, false)

  const { t } = useTranslation('catalog')
  const router = useRouter()
  const routerTabs: IRouterTab[] = useMemo(
    () => [
      {
        content: <Catalogs key="Catalogs" content={catalogsFields.data} />,
        default: true,
        id: 0,
        label: firstLetterUppercase(t('catalog_other')),
        title: firstLetterUppercase(t('catalog_other')),
        url: '/admin/settings/scope/catalogs',
      },
      {
        content: (
          <ActiveLocales key="ActiveLocales" content={catalogsFields.data} />
        ),
        id: 1,
        label: firstLetterUppercase(t('activeLocale_other')),
        title: firstLetterUppercase(t('activeLocale_other')),
        url: '/admin/settings/scope/activeLocales',
      },
    ],
    [catalogsFields.data, t]
  )
  const activeTab =
    routerTabs.find((tab) => tab.url === router.asPath) ??
    routerTabs.find((tab) => tab.default)
  const { id, title } = activeTab

  if (catalogsFields.error) {
    return <>{catalogsFields.error.toString()}</>
  } else if (!catalogsFields.data) {
    return null
  }

  function handleChange(id: number): void {
    const tab = routerTabs.find((tab) => tab.id === id)
    if (tab) {
      router.push(tab.url, undefined, { shallow: true })
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <SubTabs defaultActiveId={id} onChange={handleChange} tabs={routerTabs} />
    </>
  )
}

export default SettingsScope
