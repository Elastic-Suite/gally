import { HashRouter, Route, Routes } from 'react-router-dom'

import Category from '../../pages/Category/Category'
import Homepage from '../../pages/Homepage/Homepage'
import Login from '../../pages/Login/Login'
import Search from '../../pages/Search/Search'
import VectorSearch from '../../pages/VectorSearch/VectorSearch'

import Layout from '../Layout/Layout'
import AppProvider from '../Providers/AppProvider/AppProvider'

function App(): JSX.Element {
  return (
    <HashRouter basename="/">
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/index.html" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/search" element={<Search />} />
            <Route path="/vectorSearch" element={<VectorSearch />} />
          </Routes>
        </Layout>
      </AppProvider>
    </HashRouter>
  )
}

export default App
