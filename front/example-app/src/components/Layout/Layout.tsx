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
  alignItems: 'center',
  marginTop: theme.spacing(2),
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
      <Header />
      <Menu menuOpen={menuOpen} onMenuToggle={handleMenuToggle} />
      <Toolbar />
      <Main>
        <div
          style={{
            width: '75%',
            maxWidth: '1400px',
            marginBottom: '36px',
          }}
        >
          {children}
        </div>
      </Main>
    </Page>
  )
}

export default Layout
