import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../contexts/CatalogContext';
import { useSearchBarRef } from '../contexts/SearchBarContext';
import { useSearch } from './useSearch';
import { getProductFields } from '../components/ProductCard';
import { ScenarioStep, StepAction } from '../scenarios/types';

interface UseStoryActionsOptions {
  step: ScenarioStep | null;
  active: boolean;
  minimized: boolean;
}

/**
 * Generic action engine that interprets ScenarioStep.action descriptors.
 * Each action type is handled by a dedicated runner.
 * All DOM polling, highlights, navigation, and timers are managed here.
 */
export function useStoryActions({ step, active, minimized }: UseStoryActionsOptions) {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const { categories } = useCatalog();
  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;

  const searchBarRef = useSearchBarRef();
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-fetch products for add_to_cart_flow actions
  const searchQuery = step?.action.type === 'add_to_cart_flow' ? step.action.searchQuery : '';
  const { products: prefetchedProducts } = useSearch({
    searchQuery: searchQuery || undefined,
    pageSize: searchQuery ? 4 : 0,
  });
  const productsRef = useRef(prefetchedProducts);
  productsRef.current = prefetchedProducts;

  const resolveTarget = useCallback((target: string) => {
    if (target.includes('__first__') && categoriesRef.current.length > 0) {
      return `/category/${categoriesRef.current[0].id}`;
    }
    return target;
  }, []);

  // Toast helper
  const showToast = useCallback((message: string) => {
    const toast = document.createElement('div');
    toast.className = 'story-cart-toast';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 1200);
  }, []);

  // Cleanup all timers
  const cleanup = useCallback(() => {
    if (typingRef.current) { clearTimeout(typingRef.current); typingRef.current = null; }
    if (actionTimerRef.current) { clearTimeout(actionTimerRef.current); actionTimerRef.current = null; }
    document.querySelectorAll('.story-highlight, .story-highlight-btn').forEach(
      el => { el.classList.remove('story-highlight'); el.classList.remove('story-highlight-btn'); }
    );
  }, []);

  // ── Action Runners ───────────────────────────────────────

  const runTypeAndSearch = useCallback((action: Extract<StepAction, { type: 'type_and_search' }>) => {
    navigateRef.current(action.startRoute);
    const startTyping = setTimeout(() => {
      const handle = searchBarRef.current;
      if (!handle) return;
      handle.inputRef.current?.focus();
      let i = 0;
      handle.setQuery('');
      const type = () => {
        if (i <= action.query.length) {
          handle.setQuery(action.query.slice(0, i));
          i++;
          typingRef.current = setTimeout(type, 80 + Math.random() * 60);
        } else {
          actionTimerRef.current = setTimeout(() => {
            navigateRef.current(`/search?q=${encodeURIComponent(action.query)}`);
            handle.clear();
          }, 800);
        }
      };
      typingRef.current = setTimeout(type, 300);
    }, 400);
    return () => {
      clearTimeout(startTyping);
      cleanup();
    };
  }, [searchBarRef, cleanup]);

  const runHighlightSequence = useCallback((
    action: Extract<StepAction, { type: 'highlight_sequence' }>,
    target: string,
  ) => {
    navigateRef.current(resolveTarget(target));
    let attempts = 0;
    const tryHighlight = () => {
      const parent = document.querySelector(action.selector) as HTMLElement | null;
      const children = document.querySelectorAll(action.childSelector);
      if ((!parent || children.length === 0) && attempts < 20) {
        attempts++;
        actionTimerRef.current = setTimeout(tryHighlight, 300);
        return;
      }
      if (!parent || children.length === 0) return;

      parent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      parent.classList.add('story-highlight');

      const items = Array.from(children).slice(0, action.maxItems);
      let idx = 0;
      const highlightNext = () => {
        if (idx === 0) parent.classList.remove('story-highlight');
        if (idx > 0) items[idx - 1].classList.remove('story-highlight');
        if (idx >= items.length) return;
        const el = items[idx] as HTMLElement;
        el.classList.add('story-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        idx++;
        actionTimerRef.current = setTimeout(highlightNext, action.interval);
      };
      actionTimerRef.current = setTimeout(highlightNext, action.interval);
    };
    actionTimerRef.current = setTimeout(tryHighlight, 500);
    return () => cleanup();
  }, [resolveTarget, cleanup]);

  const runAddToCartFlow = useCallback((
    _action: Extract<StepAction, { type: 'add_to_cart_flow' }>,
    target: string,
  ) => {
    navigateRef.current(resolveTarget(target));
    let attempts = 0;
    const tryFlow = () => {
      const firstCard = document.querySelector('.product-card') as HTMLElement | null;
      const products = productsRef.current;
      if ((!firstCard || products.length === 0) && attempts < 20) {
        attempts++;
        actionTimerRef.current = setTimeout(tryFlow, 300);
        return;
      }
      if (!firstCard || products.length === 0) {
        navigateRef.current('/cart');
        return;
      }

      firstCard.classList.add('story-highlight');
      firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Extract SKU from DOM link
      const cardLink = firstCard.querySelector('a[href*="/product/"]') as HTMLAnchorElement | null;
      let sku = '';
      if (cardLink) {
        const match = cardLink.getAttribute('href')?.match(/\/product\/(.+)/);
        if (match) sku = match[1];
      }
      if (!sku && products.length > 0) {
        sku = getProductFields(products[0]).sku;
      }

      actionTimerRef.current = setTimeout(() => {
        firstCard.classList.remove('story-highlight');
        if (!sku) { navigateRef.current('/cart'); return; }
        navigateRef.current(`/product/${encodeURIComponent(sku)}`);

        let pdpAttempts = 0;
        const tryAdd = () => {
          const btn = document.querySelector('.product-detail-actions .btn-coral') as HTMLElement | null;
          if (!btn && pdpAttempts < 20) {
            pdpAttempts++;
            actionTimerRef.current = setTimeout(tryAdd, 300);
            return;
          }
          if (!btn) { navigateRef.current('/cart'); return; }

          btn.classList.add('story-highlight-btn');
          btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

          actionTimerRef.current = setTimeout(() => {
            btn.click();
            btn.classList.remove('story-highlight-btn');
            showToast('✓ Produit ajouté au panier');
            actionTimerRef.current = setTimeout(() => navigateRef.current('/cart'), 1500);
          }, 1000);
        };
        tryAdd();
      }, 1200);
    };
    actionTimerRef.current = setTimeout(tryFlow, 500);
    return () => cleanup();
  }, [resolveTarget, showToast, cleanup]);

  // ── Effect: run action when step changes ─────────────────

  useEffect(() => {
    if (!active || minimized || !step) return;

    const { action, target } = step;

    switch (action.type) {
      case 'type_and_search':
        return runTypeAndSearch(action);
      case 'highlight_sequence':
        return runHighlightSequence(action, target);
      case 'add_to_cart_flow':
        return runAddToCartFlow(action, target);
      case 'navigate_only':
      default:
        navigateRef.current(resolveTarget(target));
        return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, active, minimized]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);
}
