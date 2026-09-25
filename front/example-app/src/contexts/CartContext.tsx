import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { getTracker, TrackingEventType } from '../sdk';
import { useCatalog } from './CatalogContext';

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  qty: number;
  variant?: string;
  childSku?: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeFromCart: (sku: string, variant?: string) => void;
  updateQty: (sku: string, qty: number, variant?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  /** False until the saved cart has been read from localStorage (first client effect). */
  ready: boolean;
}

// The cart survives a page reload (a demo that loses its cart on refresh loses the story), and
// each catalog keeps its own: a toolbox drill has no place in the fashion cart. Keyed on the
// catalog, not the localized catalog - the French and English stores sell the same products.
const storageKey = (catalogCode: string) => `gally-example-cart:${catalogCode}`;

function readStoredCart(catalogCode: string): CartItem[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey(catalogCode)) || '[]');
    return Array.isArray(parsed)
      ? parsed.filter(i => i && typeof i.sku === 'string' && typeof i.price === 'number' && i.qty > 0)
      : [];
  } catch {
    return [];
  }
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // The catalog whose saved cart is in `items`. Null until the first read.
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const { selectedCatalog, selectedLocalizedCatalog } = useCatalog();
  const catalogCode = selectedCatalog?.code ?? null;
  const ready = loadedFor !== null && loadedFor === catalogCode;

  // Read storage in an effect, not in useState's initializer: this provider also renders on the
  // server, where there is no localStorage, and a first client render that differed from the
  // server's would be a hydration mismatch. Runs again on a catalog switch to load that cart.
  useEffect(() => {
    if (!catalogCode) return;
    setItems(readStoredCart(catalogCode));
    setLoadedFor(catalogCode);
  }, [catalogCode]);

  // Save only when `items` belongs to the current catalog. Right after a switch, the render still
  // holds the previous catalog's items; writing then would copy them into the new catalog's cart.
  useEffect(() => {
    if (!ready || !loadedFor) return;
    try {
      window.localStorage.setItem(storageKey(loadedFor), JSON.stringify(items));
    } catch {
      // Private mode or a full quota: the cart still works for this page view.
    }
  }, [items, ready, loadedFor]);

  const addToCart = useCallback((item: Omit<CartItem, 'qty'>, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.sku === item.sku && i.variant === item.variant);
      if (existing) {
        return prev.map(i =>
          i.sku === item.sku && i.variant === item.variant
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [...prev, { ...item, qty }];
    });

    // Track add to cart
    try {
      getTracker().push({
        eventType: TrackingEventType.ADD_TO_CART,
        metadataCode: 'product',
        localizedCatalogCode: selectedLocalizedCatalog?.code || "",
        entityCode: item.sku,
        payload: JSON.stringify({
          cart: { qty },
          child_sku: item.childSku || item.sku,
        }),
      });
    } catch (e) {
      console.warn('[Tracker] add_to_cart error', e);
    }
  }, [selectedLocalizedCatalog]);

  // A line is identified by sku AND variant — the same pair addToCart dedupes on above. Keying
  // on the sku alone was invisible while nothing ever set `variant`; now that the product page
  // has a working option selector, one parent can hold several lines ("Pluie / M" and
  // "Menthe / L"), and removing one of them would have taken the others with it.
  const removeFromCart = useCallback((sku: string, variant?: string) => {
    setItems(prev => prev.filter(i => !(i.sku === sku && i.variant === variant)));
  }, []);

  const updateQty = useCallback((sku: string, qty: number, variant?: string) => {
    if (qty <= 0) {
      removeFromCart(sku, variant);
    } else {
      setItems(prev => prev.map(i =>
        i.sku === sku && i.variant === variant ? { ...i, qty } : i
      ));
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, itemCount, ready }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
