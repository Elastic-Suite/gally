import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { useUser } from '~/hooks'

import InputText from '~/components/atoms/form/InputText'
import PageTitle from '~/components/atoms/PageTitle/PageTitle'

function Login(): JSX.Element {
  const router = useRouter()
  const user = useUser()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  if (user) {
    // todo: redirect to the last requested page
    router.push('/admin')
  }

  const title = 'Login'
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTitle title={title} />
      <div>
        <InputText label="login" onChange={setLogin} value={login} />
        <InputText label="password" onChange={setPassword} value={password} />
      </div>
    </div>
  )
}

export default Login
