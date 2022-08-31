import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function Settings(): null {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      router.push('/admin/settings/scope/catalogs')
    }
  })

  return null
}

export default Settings
