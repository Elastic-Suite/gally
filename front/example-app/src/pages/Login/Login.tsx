import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import { ILogin, isError, isValidUser } from 'shared'

import { requestedPathContext, userContext } from '../../contexts'
import { useApiFetch } from '../../hooks'

import Title from '../../components/Title/Title'

function Login(): JSX.Element {
  const navigate = useNavigate()
  const { user, setToken } = useContext(userContext)
  const { requestedPath } = useContext(requestedPathContext)

  const fetchApi = useApiFetch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const redirectToRequestedPath = useCallback(
    () => navigate(requestedPath),
    [navigate, requestedPath]
  )

  useEffect(() => {
    if (isValidUser(user)) {
      redirectToRequestedPath()
    }
  }, [redirectToRequestedPath, user])

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    fetchApi<ILogin>('/authentication_token', undefined, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).then((json) => {
      if (!isError(json)) {
        setToken(json.token)
        // redirectToRequestedPath()
      }
    })
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>): void {
    setEmail(event.target.value)
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
    setPassword(event.target.value)
  }

  return (
    <>
      <Title title="Login" />
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          onChange={handleEmailChange}
          value={email}
        />
        <TextField
          fullWidth
          label="Password"
          margin="normal"
          onChange={handlePasswordChange}
          type="password"
          value={password}
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </form>
    </>
  )
}

export default Login
