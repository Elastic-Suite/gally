import { useEffect } from 'react'
import { useRouter } from 'next/router'

function Welcome(): void {
  const router = useRouter()
  useEffect(() => {
    router.push('/login')
  }, [router])

  return null
}

export default Welcome
