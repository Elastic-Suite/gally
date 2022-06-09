import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { fetchDocs, useAppSelector, useAppDispatch, selectDocs } from '~/store'
import { LoadStatus } from '~/types'

export async function getStaticProps() {
  return {
    props: {},
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

/* This page was created through dynamic routes from NextJS : https://nextjs.org/docs/routing/dynamic-routes */
const Admin = () => {
  const router = useRouter()
  const { slug } = router.query

  const dispatch = useAppDispatch()
  const docs = useAppSelector(selectDocs)

  // Fetch jsonld
  useEffect(() => {
    if (docs.status === LoadStatus.IDLE) {
      dispatch(fetchDocs())
    }
  }, [dispatch, docs.status])

  if (docs.error) {
    return docs.error
  } else if (!docs.json && docs.jsonld) {
    return null
  }

  return (
    <div>
      Temporaire ! Voici le slug codifié :{' '}
      {typeof slug !== 'string' ? slug?.join('_') : slug}
    </div>
  )
}

export default Admin
