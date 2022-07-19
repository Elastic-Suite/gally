import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export const getStaticProps: GetStaticProps = () => ({ props: {} })

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: true,
})

/* This page was created through dynamic routes from NextJS : https://nextjs.org/docs/routing/dynamic-routes */
function Admin(): JSX.Element {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { slug } = router.query

  return (
    <div>
      {t('temporary-slug')} {typeof slug !== 'string' ? slug?.join('_') : slug}
    </div>
  )
}

export default Admin
