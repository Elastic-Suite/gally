import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'

import { withAuth, withOptions } from '~/hocs'
import { breadcrumbContext } from '~/contexts'

function Dashboard(): JSX.Element {
  const router = useRouter()

  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(['dashboard'])
  }, [router.query, setBreadcrumb])

  // todo: temporary page
  return <div>Dashboard</div>
}

export default withAuth(withOptions(Dashboard))
