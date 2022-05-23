import Head from 'next/head'
import { useRouter } from 'next/router'

/*
 * This function is to prevent reload once client is loaded
 * Solution found here : https://stackoverflow.com/questions/65859612/id-is-gone-when-i-refresh-a-nextjs-dynamic-route-page
 */

export async function getServerSideProps(context) {
  return {
    props: {},
  }
}

/* This page was created through dynamic routes from NextJS : https://nextjs.org/docs/routing/dynamic-routes */
const AdminLoader = () => {
  const router = useRouter()
  const { slug } = router.query
  return (
    <>
      <div>
        Temporaire ! Voici le slug codifié :{' '}
        {typeof slug !== 'string' ? slug?.join('_') : slug}
      </div>
    </>
  )
}

const Admin = () => (
  <>
    <Head>
      <title>Blink Admin</title>
    </Head>

    <AdminLoader />
  </>
)
export default Admin
