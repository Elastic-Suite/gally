import { ReactNode, useState } from 'react'
import { Toolbar, styled } from '@mui/material'

import Header from '../Header/Header'
import Menu from '../Menu/Menu'

const Page = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
})

const Main = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  padding: theme.spacing(3),
}))

interface IProps {
  children: ReactNode
}

function Layout(props: IProps): JSX.Element {
  const { children } = props
  const [menuOpen, setMenuOpen] = useState(false)

  function handleMenuToggle(): void {
    setMenuOpen((prevState) => !prevState)
  }

  return (
    <Page>
      <Header onMenuToggle={handleMenuToggle} />
      <Menu menuOpen={menuOpen} onMenuToggle={handleMenuToggle} />
      <Toolbar />
      <Main>{children}</Main>
    </Page>
  )
}

export default Layout