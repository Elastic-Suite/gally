import { useEffect, useState } from 'react';
import { useCatalog } from '../contexts/CatalogContext';
import { fetchProductRecommendations, type RecommendationType } from '../sdk/recommendations';

// Recommendations for a set of seed SKUs, tried in order: the first type that returns anything
// wins. The PDP asks for related products and falls back to cross-sell, because some catalogues
// (papershop) have no related-product rules at all.
export function useRecommendations(types: RecommendationType[], skus: string[], count: number) {
  const { selectedCatalog, selectedLocalizedCatalog } = useCatalog();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Joined keys, so a new array with the same contents does not refetch on every render.
  const typesKey = types.join(',');
  const skusKey = Array.from(new Set(skus)).sort().join(',');
  const localizedCatalog = selectedLocalizedCatalog?.code;
  const catalogCode = selectedCatalog?.code ?? '';

  useEffect(() => {
    if (!localizedCatalog || !skusKey) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      let found: any[] = [];
      for (const type of typesKey.split(',') as RecommendationType[]) {
        found = await fetchProductRecommendations(localizedCatalog, catalogCode, type, skusKey.split(','), count);
        if (cancelled || found.length > 0) break;
      }
      if (cancelled) return;
      setProducts(found);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [localizedCatalog, catalogCode, typesKey, skusKey, count]);

  return { products, loading };
}
