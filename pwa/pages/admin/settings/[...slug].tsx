import { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { breadcrumbContext } from '~/contexts'
import { findBreadcrumbLabel, getRouterPath } from '~/services'
import { selectMenu, useAppSelector } from '~/store'
import { IRouterTab } from '~/types'

import PageTile from '~/components/atoms/PageTitle/PageTitle'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import SettingsAttributes from '~/components/stateful-pages/SettingsAttributes/SettingsAttributes'
import SettingsScope from '~/components/stateful-pages/SettingsScope/SettingsScope'

const pageSlug = 'settings'

function Settings(): JSX.Element {
  const { t } = useTranslation(pageSlug)
  const router = useRouter()
  const menu = useAppSelector(selectMenu)
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    const { slug } = router.query
    setBreadcrumb([pageSlug, ...slug])
  }, [router.query, setBreadcrumb])

  const routerTabs: IRouterTab[] = useMemo(
    () => [
      {
        content: <SettingsScope />,
        default: true,
        id: 0,
        label: t('tabs.scope'),
        url: '/admin/settings/scope',
      },
      {
        actions: <PrimaryButton>{t('action.import')} (xlsx)</PrimaryButton>,
        content: <SettingsAttributes />,
        id: 1,
        label: t('tabs.attributes'),
        url: '/admin/settings/attributes',
      },
    ],
    [t]
  )
  const pathname = getRouterPath(router.asPath)
  const activeTab =
    routerTabs.find((tab) => tab.url === pathname) ??
    routerTabs.find((tab) => tab.default)
  const { actions, id } = activeTab

  function handleChange(id: number): void {
    const tab = routerTabs.find((tab) => tab.id === id)
    if (tab) {
      router.push(tab.url, undefined, { shallow: true })
    }
  }

  const title = findBreadcrumbLabel(0, [pageSlug], menu.hierarchy)

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTile title={title}>{actions}</PageTile>
      <CustomTabs
        defaultActiveId={id}
        onChange={handleChange}
        tabs={routerTabs}
      />
    </>
  )
}

export default Settings
