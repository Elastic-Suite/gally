import { Routes, Route } from 'react-router-dom';
import { EventLogProvider } from './contexts/EventLogContext';
import Header from './components/Header';
import Footer from './components/Footer';
import EventLog from './components/EventLog';
import Homepage from './pages/Homepage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CmsPage from './pages/CmsPage';
import VectorSearchPage from './pages/VectorSearchPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <EventLogProvider>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/category/:code" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product/:sku" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cms/:slug" element={<CmsPage />} />
            <Route path="/vector-search" element={<VectorSearchPage />} />
          </Routes>
        </main>
        <Footer />
        <EventLog />
      </div>
    </EventLogProvider>
  );
}

export default App;
