import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { getTracker, TrackingEventType } from '../sdk';
import { useCatalog } from './CatalogContext';

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  qty: number;
  variant?: string;
  childSku?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeFromCart: (sku: string) => void;
  updateQty: (sku: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { selectedLocalizedCatalog } = useCatalog();

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
          ...(item.childSku && { child_sku: item.childSku }),
        }),
      });
    } catch (e) {
      console.warn('[Tracker] add_to_cart error', e);
    }
  }, [selectedLocalizedCatalog]);

  const removeFromCart = useCallback((sku: string) => {
    setItems(prev => prev.filter(i => i.sku !== sku));
  }, []);

  const updateQty = useCallback((sku: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.sku !== sku));
    } else {
      setItems(prev => prev.map(i => i.sku === sku ? { ...i, qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
