import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Homepage from '../../pages/Homepage/Homepage'

import Header from '../Header/Header'
import Menu from '../Menu/Menu'
import AppProvider from '../Providers/AppProvider/AppProvider'

function App(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)

  function handleMenuToggle(): void {
    setMenuOpen((prevState) => !prevState)
  }

  return (
    <BrowserRouter basename="/example">
      <AppProvider>
        <Header onMenuToggle={handleMenuToggle} />
        <Menu menuOpen={menuOpen} onMenuToggle={handleMenuToggle} />
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
