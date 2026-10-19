import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { fetchCatalogs, defaultLocalizedCatalog } from '../src/sdk/catalogs'

// Bare `/` carries no catalog, so it cannot render anything meaningful. Resolve the
// default localized catalog server-side and redirect to its segment, which is the same
// catalog the SPA used to select on mount. Next prefixes basePath onto the redirect,
// so this lands on /example/<code>.
//
// connection() keeps this page out of `next build` prerendering: the API is not reachable
// during a docker build, and the redirect must follow the live catalogs anyway.
export default async function RootRedirect() {
  await connection()
  const catalogs = await fetchCatalogs()
  const resolved = defaultLocalizedCatalog(catalogs)

  if (!resolved) {
    throw new Error(
      'No catalogs returned by the API — cannot resolve a default locale for /'
    )
  }

  redirect(`/${resolved.localizedCatalog.code}`)
}
