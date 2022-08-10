import { FormEvent, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Paper } from '@mui/material'

import { tokenStorageKey } from '~/constants'
import { useApiFetch, useUser } from '~/hooks'
import { storageSet } from '~/services'
import { selectRequestedPath, useAppSelector } from '~/store'
import { ILogin } from '~/types'

import InputText from '~/components/atoms/form/InputText'
import PageTitle from '~/components/atoms/PageTitle/PageTitle'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'

function Login(): JSX.Element {
  const { t } = useTranslation('login')
  const { push } = useRouter()
  const user = useUser()
  const requestedPath = useAppSelector(selectRequestedPath)

  const fetchApi = useApiFetch<ILogin>()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const redirectToRequestedPath = useCallback(
    () => push(requestedPath ?? '/admin'),
    [push, requestedPath]
  )

  useEffect(() => {
    if (user) {
      redirectToRequestedPath()
    }
  }, [redirectToRequestedPath, user])

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    fetchApi('/authentication_token', undefined, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).then((json) => {
      storageSet(tokenStorageKey, json.token)
      redirectToRequestedPath()
    })
  }

  const title = t('title.login')
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTitle title={title} />
      <Paper sx={{ padding: 4 }}>
        <form onSubmit={handleSubmit}>
          <InputText
            fullWidth
            label={t('label.email')}
            onChange={setEmail}
            value={email}
            withMargin
          />
          <InputText
            fullWidth
            label={t('label.password')}
            onChange={setPassword}
            type="password"
            value={password}
            withMargin
          />
          <PrimaryButton type="submit">{t('action.login')}</PrimaryButton>
        </form>
      </Paper>
    </div>
  )
}

export default Login
