import { useRouter } from 'next/router'

import { IRouterTab } from 'shared'
import { renderHookWithProviders } from '~/utils/tests'

import { useTabs } from './useTabs'

const routerTabs: IRouterTab[] = [
  {
    Component: () => <>Content 1</>,
    default: true,
    id: 0,
    label: 'Title 1',
    url: '/test1',
  },
  {
    Component: () => <>Content 2</>,
    id: 1,
    label: 'Title 2',
    url: '/test2',
  },
]

describe('useTabs', () => {
  it('should return the default tab', () => {
    const { result } = renderHookWithProviders(() => useTabs(routerTabs))
    expect(result.current[0]).toEqual(routerTabs[0])
  })

  it('should return the tab matching the URL', () => {
    const router = useRouter()
    const oldPath = router.asPath
    router.asPath = '/test2'
    const { result } = renderHookWithProviders(() => useTabs(routerTabs))
    expect(result.current[0]).toEqual(routerTabs[1])
    router.asPath = oldPath
  })

  it('should redirect', () => {
    const router = useRouter()
    const pushSpy = router.push as jest.Mock
    pushSpy.mockClear()
    const { result } = renderHookWithProviders(() => useTabs(routerTabs))
    result.current[1](1)
    expect(pushSpy).toHaveBeenCalledWith('/test2', undefined, { shallow: true })
  })

  it('should not redirect for unknown id', () => {
    const router = useRouter()
    const pushSpy = router.push as jest.Mock
    pushSpy.mockClear()
    const { result } = renderHookWithProviders(() => useTabs(routerTabs))
    result.current[1](2)
    expect(pushSpy).not.toHaveBeenCalled()
  })
})
