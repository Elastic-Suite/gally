import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { fetchJsonld, useAppSelector, useAppDispatch, selectJsonld } from '~/store'
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
  const jsonld = useAppSelector(selectJsonld)

  // Fetch jsonld
  useEffect(() => {
    if (jsonld.status === LoadStatus.IDLE) {
      dispatch(fetchJsonld())
    }
  }, [dispatch, jsonld.status])

  if (jsonld.error) {
    return jsonld.error
  } else if (!jsonld.data) {
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
