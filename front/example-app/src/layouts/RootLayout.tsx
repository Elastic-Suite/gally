import { Outlet } from 'react-router'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
