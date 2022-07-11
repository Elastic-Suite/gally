import { useEffect } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { fetchDocs, selectDocs, useAppDispatch, useAppSelector } from '~/store'
import { LoadStatus } from '~/types'

export const getStaticProps: GetStaticProps = () => ({ props: {} })

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: true,
})

/* This page was created through dynamic routes from NextJS : https://nextjs.org/docs/routing/dynamic-routes */
function Admin(): JSX.Element | string {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { slug } = router.query

  const dispatch = useAppDispatch()
  const docs = useAppSelector(selectDocs)

  // Fetch docs
  useEffect(() => {
    if (docs.status === LoadStatus.IDLE) {
      dispatch(fetchDocs())
    }
  }, [dispatch, docs.status])

  if (docs.error) {
    return docs.error.toString()
  } else if (!docs.data) {
    return null
  }

  return (
    <div>
      {t('temporary-slug')} {typeof slug !== 'string' ? slug?.join('_') : slug}
    </div>
  )
}

export default Admin
