import { Routes, Route } from 'react-router-dom';
import { EventLogProvider } from './contexts/EventLogContext';
import { useDemo } from './contexts/DemoContext';
import Header from './components/Header';
import Footer from './components/Footer';
import EventLog from './components/EventLog';
import IntroScreen from './components/IntroScreen';
import StoryCompanion from './components/StoryCompanion';
import ScrollToTop from './components/ScrollToTop';
import TrackingInsights from './components/TrackingInsights';
import SearchExplain from './components/SearchExplain';
import Homepage from './pages/Homepage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CmsPage from './pages/CmsPage';
import VectorSearchPage from './pages/VectorSearchPage';
import CheckoutPage from './pages/CheckoutPage';
import ClosingPage from './pages/ClosingPage';

function App() {
  const { introSeen, audience } = useDemo();

  if (!introSeen) {
    return <IntroScreen />;
  }

  return (
    <EventLogProvider>
      <ScrollToTop />
      <div className={`app-layout mode-${audience}`}>
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
            <Route path="/explain" element={<VectorSearchPage />} />
            <Route path="/closing" element={<ClosingPage />} />
          </Routes>
        </main>
        <Footer />
        <div className="expert-only">
          <EventLog />
        </div>
        <TrackingInsights />
        <SearchExplain />
        <StoryCompanion />
      </div>
    </EventLogProvider>
  );
}

export default App;
