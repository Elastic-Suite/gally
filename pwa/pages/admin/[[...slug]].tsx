import { useRouter } from 'next/router'
import { useEffect } from 'react'

/*
 * This function is to prevent reload once client is loaded
 * Solution found here : https://stackoverflow.com/questions/65859612/id-is-gone-when-i-refresh-a-nextjs-dynamic-route-page
 */

function mappingMenu(item) {
  if (!item.children) {
    return { params: { slug: item.code } }
  } else if (item.code === 'monitoring' || item.code === 'settings') {
    return { params: { slug: item.code } }
  } else {
    item.children.map(mappingMenu)
  }
}

export async function getStaticProps() {
  return {
    props: {},
  }
}

export async function getStaticPaths() {
  // Call an external API endpoint to get products

  let menu = { hierarchy: [] }

  /*
   * Fetch data from /menu to get create menu items dynamically
   */
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/menu')
      const json = await res.json()
      menu = { ...json }
    }
    fetchData(), [menu]
  })
  // Get the paths we want to pre-render based on posts
  const paths = menu.hierarchy.map(mappingMenu)
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

/* This page was created through dynamic routes from NextJS : https://nextjs.org/docs/routing/dynamic-routes */
const Admin = () => {
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

export default Admin
