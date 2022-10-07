import { withAuth } from '~/hocs'
import React, { useContext, useEffect } from 'react'
import { breadcrumbContext } from '~/contexts'
import { useRouter } from 'next/router'

function Dashboard(): JSX.Element {
  const router = useRouter()

  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(['dashboard'])
  }, [router.query, setBreadcrumb])

  // todo: temporary page
  return <div>Dashboard</div>
}

export default withAuth(Dashboard)
