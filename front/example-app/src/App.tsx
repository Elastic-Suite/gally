import { Route, Routes } from 'react-router'
import { RootLayout } from './layouts/RootLayout'
import { HomePage } from './pages/HomePage'
import { CategoryPage } from './pages/CategoryPage'
import { SearchResultsPage } from './pages/SearchResultsPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ThankYouPage } from './pages/ThankYouPage'
import { BlogIndexPage } from './pages/BlogIndexPage'
import { BlogArticlePage } from './pages/BlogArticlePage'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/product/:urlKey" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/blogs" element={<BlogIndexPage />} />
        <Route path="/blogs/:slug" element={<BlogArticlePage />} />
      </Route>
    </Routes>
  )
}
