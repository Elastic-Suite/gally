import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Homepage from '../../pages/Homepage/Homepage'
import Login from '../../pages/Login/Login'

import Layout from '../Layout/Layout'
import AppProvider from '../Providers/AppProvider/AppProvider'

function App(): JSX.Element {
  return (
    <BrowserRouter basename="/example">
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
