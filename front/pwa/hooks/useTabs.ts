import { useCallback } from 'react'
import { useRouter } from 'next/router'

import { IRouterTab, getRouterPath } from 'gally-admin-shared'

export function useTabs(
  tabs: IRouterTab[]
): [IRouterTab, (id: number) => void] {
  const router = useRouter()
  const { push } = router
  const pathname = getRouterPath(router.asPath)
  const activeTab =
    tabs.find((tab) => tab.url === pathname) ?? tabs.find((tab) => tab.default)

  const handleTabChange = useCallback(
    (id: number): void => {
      const tab = tabs.find((tab) => tab.id === id)
      if (tab) {
        push(tab.url, undefined, { shallow: true })
      }
    },
    [push, tabs]
  )

  return [activeTab, handleTabChange]
}
