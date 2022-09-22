import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Homepage from '../../pages/Homepage/Homepage'

import Header from '../Header/Header'
import Menu from '../Menu/Menu'
import AppProvider from '../AppProvider/AppProvider'

function App(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false)
  const [catalogId, setCatalogId] = useState<string | number>('')
  const [localizedCatalogId, setLocalizedCatalogId] = useState<string | number>(
    ''
  )

  function handleMenuToggle(): void {
    setMenuOpen((prevState) => !prevState)
  }

  return (
    <BrowserRouter basename="/example">
      <AppProvider>
        <Header
          catalogId={catalogId}
          localizedCatalogId={localizedCatalogId}
          onCatalogIdChange={setCatalogId}
          onLocalizedCatalogIdChange={setLocalizedCatalogId}
          onMenuToggle={handleMenuToggle}
        />
        <Menu menuOpen={menuOpen} onMenuToggle={handleMenuToggle} />
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
