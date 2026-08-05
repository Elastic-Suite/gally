import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getTracker, TrackingEventType } from '../sdk';
import { useCatalog } from '../contexts/CatalogContext';
import { useEventLog } from '../contexts/EventLogContext';

export function useTracking() {
  const { t } = useTranslation('demo');
  const { selectedLocalizedCatalog } = useCatalog();
  const { log } = useEventLog();

  // Use refs to avoid recreating callbacks when catalog/log change
  const catalogCodeRef = useRef(selectedLocalizedCatalog?.code || '');
  catalogCodeRef.current = selectedLocalizedCatalog?.code || '';
  const logRef = useRef(log);
  logRef.current = log;

  const trackCategoryView = useCallback((categoryCode: string, itemCount: number, page: number, pageCount: number) => {
    logRef.current('VIEW:category', categoryCode, t('trackingMeaning.categoryView', { categoryCode }));
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
  }, [t]);

  const trackProductView = useCallback((sku: string) => {
    logRef.current('VIEW:product', sku, t('trackingMeaning.productView', { sku }));
    try {
      getTracker().push({
        eventType: TrackingEventType.VIEW,
        metadataCode: 'product',
        localizedCatalogCode: catalogCodeRef.current,
        entityCode: sku,
      });
    } catch (e) { console.warn('[Tracker]', e); }
  }, [t]);

  const trackSearch = useCallback((query: string, itemCount: number, page: number, pageCount: number) => {
    logRef.current('SEARCH', query, t('trackingMeaning.search', { query, count: itemCount }));
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
  }, [t]);

  const trackDisplay = useCallback((items: { sku: string; position: number }[]) => {
    logRef.current('DISPLAY', `${items.length} items`, t('trackingMeaning.display', { count: items.length }));
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
  }, [t]);

  const trackAddToCart = useCallback((sku: string, qty: number, childSku?: string) => {
    logRef.current('ADD_TO_CART', `${sku} x${qty}`, t('trackingMeaning.addToCart', { sku, qty }));
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
  }, [t]);

  const trackOrder = useCallback((orderId: string, total: number, items: { sku: string; childSku?: string; price: number; qty: number }[]) => {
    logRef.current('ORDER', `#${orderId} — ${total}`, t('trackingMeaning.order', { orderId, total, count: items.length }));
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
  }, [t]);

  return { trackCategoryView, trackProductView, trackSearch, trackDisplay, trackAddToCart, trackOrder };
}
