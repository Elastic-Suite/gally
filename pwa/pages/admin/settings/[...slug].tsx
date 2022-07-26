import { useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { IRouterTab } from '~/types'

import PageTile from '~/components/atoms/PageTitle/PageTitle'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'
import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import SettingsAttributes from '~/components/stateful-pages/SettingsAttributes/SettingsAttributes'
import SettingsScope from '~/components/stateful-pages/SettingsScope/SettingsScope'

function Settings(): JSX.Element {
  const { t } = useTranslation('settings')
  const router = useRouter()
  const routerTabs: IRouterTab[] = useMemo(
    () => [
      {
        content: <SettingsScope />,
        default: true,
        id: 0,
        label: t('tabs.scope'),
        title: t('title.catalog'),
        url: '/admin/settings/scope',
      },
      {
        actions: <PrimaryButton>{t('action.import')} (xlsx)</PrimaryButton>,
        content: <SettingsAttributes />,
        id: 1,
        label: t('tabs.attributes'),
        title: t('title.attributes'),
        url: '/admin/settings/attributes',
      },
    ],
    [t]
  )
  const activeTab =
    routerTabs.find((tab) => tab.url === router.asPath) ??
    routerTabs.find((tab) => tab.default)
  const { actions, id, title } = activeTab

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
