import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { selectMenu, useAppSelector } from '~/store'
import BreadCrumbs from '~/components/atoms/breadcrumb/BreadCrumbs'

const BreadCrumb = () => {
  const menu = useAppSelector(selectMenu)
  const router = useRouter()
  const { slug } = router.query
  const [ready, setReady] = useState([''])

  function NewSlug(data: string[] | string) {
    let newBreadCrumbData = [data[0]]
    for (let index = 0; index < data.length - 1; index++) {
      newBreadCrumbData = [
        ...newBreadCrumbData,
        [newBreadCrumbData.pop()].concat(data[index + 1]).join('_'),
      ]
    }
    return newBreadCrumbData
  }

  useEffect(() => {
    slug && setReady(NewSlug(slug))
  }, [slug])

  return ready && <BreadCrumbs slug={ready} menu={menu} />
}

export default BreadCrumb
