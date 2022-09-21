import { useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { breadcrumbContext } from '~/contexts'
import { withAuth } from '~/hocs'
import { useTabs } from '~/hooks'
import { selectMenu, useAppSelector } from '~/store'
import { IRouterTab, findBreadcrumbLabel } from 'shared'

import PageTitle from '~/components/atoms/PageTitle/PageTitle'
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
        Component: SettingsScope,
        default: true,
        id: 0,
        label: t('tabs.scope'),
        url: '/admin/settings/scope',
      },
      {
        // actions: <Button>{t('action.import')} (xlsx)</Button>,
        Component: SettingsAttributes,
        id: 1,
        label: t('tabs.attributes'),
        url: '/admin/settings/attributes',
      },
    ],
    [t]
  )
  const [activeTab, handleTabChange] = useTabs(routerTabs)
  const { actions, id } = activeTab
  const title = findBreadcrumbLabel(0, [pageSlug], menu.hierarchy)

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTitle title={title}>{actions}</PageTitle>
      <CustomTabs
        defaultActiveId={id}
        onChange={handleTabChange}
        tabs={routerTabs}
      />
    </>
  )
}

export default withAuth(Settings)
