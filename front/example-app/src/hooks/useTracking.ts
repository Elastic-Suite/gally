import { useCallback, useRef } from 'react';
import { getTracker, TrackingEventType } from '../sdk';
import { useCatalog } from '../contexts/CatalogContext';
import { useEventLog } from '../contexts/EventLogContext';

export function useTracking() {
  const { selectedLocalizedCatalog } = useCatalog();
  const { log } = useEventLog();

  // Use refs to avoid recreating callbacks when catalog/log change
  const catalogCodeRef = useRef(selectedLocalizedCatalog?.code || '');
  catalogCodeRef.current = selectedLocalizedCatalog?.code || '';
  const logRef = useRef(log);
  logRef.current = log;

  const trackCategoryView = useCallback((categoryCode: string, itemCount: number, page: number, pageCount: number) => {
    logRef.current('VIEW:category', categoryCode, `Gally enregistre la visite de la catégorie "${categoryCode}" — permet d'analyser quelles catégories attirent le plus de trafic et d'optimiser le merchandising.`);
    try {
      getTracker().push({
        eventType: TrackingEventType.VIEW,
        metadataCode: 'category',
        localizedCatalogCode: catalogCodeRef.current,
        entityCode: categoryCode,
        payload: JSON.stringify({
          product_list: {
            item_count: itemCount,
            current_page: page,
            page_count: pageCount,
            sort_order: 'position',
            sort_direction: 'asc',
            filters: [],
          },
        }),
      });
    } catch (e) { console.warn('[Tracker]', e); }
  }, []);

  const trackProductView = useCallback((sku: string) => {
    logRef.current('VIEW:product', sku, `Gally enregistre la consultation du produit "${sku}" — alimente le score de popularité et les recommandations personnalisées.`);
    try {
      getTracker().push({
        eventType: TrackingEventType.VIEW,
        metadataCode: 'product',
        localizedCatalogCode: catalogCodeRef.current,
        entityCode: sku,
      });
    } catch (e) { console.warn('[Tracker]', e); }
  }, []);

  const trackSearch = useCallback((query: string, itemCount: number, page: number, pageCount: number) => {
    logRef.current('SEARCH', query, `Gally enregistre la recherche "${query}" (${itemCount} résultats) — améliore l'autocomplete, détecte les recherches sans résultat, et affine la pertinence.`);
    try {
      getTracker().push({
        eventType: TrackingEventType.SEARCH,
        metadataCode: 'product',
        localizedCatalogCode: catalogCodeRef.current,
        payload: JSON.stringify({
          search_query: { is_spellchecked: false, query_text: query },
          product_list: {
            item_count: itemCount,
            current_page: page,
            page_count: pageCount,
            sort_order: 'relevance',
            sort_direction: 'desc',
            filters: [],
          },
        }),
      });
    } catch (e) { console.warn('[Tracker]', e); }
  }, []);

  const trackDisplay = useCallback((items: { sku: string; position: number }[]) => {
    logRef.current('DISPLAY', `${items.length} items`, `Gally enregistre l'affichage de ${items.length} produits avec leur position — mesure le taux d'impression et optimise le classement.`);
    try {
      getTracker().push({
        eventType: TrackingEventType.DISPLAY,
        metadataCode: 'product',
        localizedCatalogCode: catalogCodeRef.current,
        payload: JSON.stringify({
          items: items.map(i => ({ entityCode: i.sku, display: { position: i.position } })),
        }),
      });
    } catch (e) { console.warn('[Tracker]', e); }
  }, []);

  const trackAddToCart = useCallback((sku: string, qty: number, childSku?: string) => {
    logRef.current('ADD_TO_CART', `${sku} x${qty}`, `Gally enregistre l'ajout au panier de "${sku}" (×${qty}) — signal fort de conversion utilisé pour booster ce produit dans les résultats.`);
    try {
      getTracker().push({
        eventType: TrackingEventType.ADD_TO_CART,
        metadataCode: 'product',
        localizedCatalogCode: catalogCodeRef.current,
        entityCode: sku,
        payload: JSON.stringify({
          cart: { qty },
          child_sku: childSku || sku,
        }),
      });
    } catch (e) { console.warn('[Tracker]', e); }
  }, []);

  const trackOrder = useCallback((orderId: string, total: number, items: { sku: string; childSku?: string; price: number; qty: number }[]) => {
    logRef.current('ORDER', `#${orderId} — ${total}`, `Gally enregistre la commande #${orderId} (${total}€, ${items.length} article(s)) — boucle le cycle : les produits achetés ensemble alimentent les recommandations "Fréquemment achetés ensemble".`);
    try {
      getTracker().push({
        eventType: TrackingEventType.ORDER,
        metadataCode: 'product',
        localizedCatalogCode: catalogCodeRef.current,
        payload: JSON.stringify({
          order: { order_id: orderId, total },
          items: items.map(i => ({
            entityCode: i.sku,
            child_sku: i.childSku || i.sku,
            order: { price: i.price, qty: i.qty, row_total: i.price * i.qty },
          })),
        }),
      });
    } catch (e) { console.warn('[Tracker]', e); }
  }, []);

  return { trackCategoryView, trackProductView, trackSearch, trackDisplay, trackAddToCart, trackOrder };
}
