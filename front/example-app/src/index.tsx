import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CatalogProvider } from './contexts/CatalogContext';
import { CartProvider } from './contexts/CartContext';
import { DemoProvider } from './contexts/DemoContext';
import { SearchBarProvider } from './contexts/SearchBarContext';
import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/example">
      <CatalogProvider>
        <CartProvider>
          <DemoProvider>
            <SearchBarProvider>
              <App />
            </SearchBarProvider>
          </DemoProvider>
        </CartProvider>
      </CatalogProvider>
    </BrowserRouter>
  </React.StrictMode>
);
