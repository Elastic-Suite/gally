import { useCallback } from 'react';
import { getTracker, TrackingEventType } from '../sdk';
import { useCatalog } from '../contexts/CatalogContext';
import { useEventLog } from '../contexts/EventLogContext';

export function useTracking() {
  const { selectedLocalizedCatalog } = useCatalog();
  const { log } = useEventLog();

  const trackCategoryView = useCallback((categoryCode: string, itemCount: number, page: number, pageCount: number) => {
    log('VIEW:category', categoryCode);
    try {
      getTracker().push({
        eventType: TrackingEventType.VIEW,
        metadataCode: 'category',
        localizedCatalogCode: selectedLocalizedCatalog?.code || "",
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
  }, [selectedLocalizedCatalog?.code || "", log]);

  const trackProductView = useCallback((sku: string) => {
    log('VIEW:product', sku);
    try {
      getTracker().push({
        eventType: TrackingEventType.VIEW,
        metadataCode: 'product',
        localizedCatalogCode: selectedLocalizedCatalog?.code || "",
        entityCode: sku,
      });
    } catch (e) { console.warn('[Tracker]', e); }
  }, [selectedLocalizedCatalog?.code || "", log]);

  const trackSearch = useCallback((query: string, itemCount: number, page: number, pageCount: number) => {
    log('SEARCH', query);
    try {
      getTracker().push({
        eventType: TrackingEventType.SEARCH,
        metadataCode: 'product',
        localizedCatalogCode: selectedLocalizedCatalog?.code || "",
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
  }, [selectedLocalizedCatalog?.code || "", log]);

  const trackDisplay = useCallback((items: { sku: string; position: number }[]) => {
    log('DISPLAY', `${items.length} items`);
    try {
      getTracker().push({
        eventType: TrackingEventType.DISPLAY,
        metadataCode: 'product',
        localizedCatalogCode: selectedLocalizedCatalog?.code || "",
        payload: JSON.stringify({
          items: items.map(i => ({ entityCode: i.sku, display: { position: i.position } })),
        }),
      });
    } catch (e) { console.warn('[Tracker]', e); }
  }, [selectedLocalizedCatalog?.code || "", log]);

  const trackAddToCart = useCallback((sku: string, qty: number, childSku?: string) => {
    log('ADD_TO_CART', `${sku} x${qty}`);
    try {
      getTracker().push({
        eventType: TrackingEventType.ADD_TO_CART,
        metadataCode: 'product',
        localizedCatalogCode: selectedLocalizedCatalog?.code || "",
        entityCode: sku,
        payload: JSON.stringify({
          cart: { qty },
          ...(childSku && { child_sku: childSku }),
        }),
      });
    } catch (e) { console.warn('[Tracker]', e); }
  }, [selectedLocalizedCatalog?.code || "", log]);

  const trackOrder = useCallback((orderId: string, total: number, items: { sku: string; childSku?: string; price: number; qty: number }[]) => {
    log('ORDER', `#${orderId} — ${total}`);
    try {
      getTracker().push({
        eventType: TrackingEventType.ORDER,
        metadataCode: 'product',
        localizedCatalogCode: selectedLocalizedCatalog?.code || "",
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
  }, [selectedLocalizedCatalog?.code || "", log]);

  return { trackCategoryView, trackProductView, trackSearch, trackDisplay, trackAddToCart, trackOrder };
}
