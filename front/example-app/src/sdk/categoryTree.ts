import { ICategoryNode } from './catalogs';

// Ids look like `cat_14` and the tree nests (Bottoms > Skirts), so this returns the whole
// ancestor chain rather than just the matching node: a breadcrumb that jumps
// Home > Skirts hides a level the site actually has.
// Shared by the category route guard and the route itself, so "does this category exist"
// is answered the same way in both.
export function findTrail(nodes: ICategoryNode[], code: string): ICategoryNode[] | null {
  for (const node of nodes) {
    if (String(node.id) === String(code)) return [node];
    const below = node.children ? findTrail(node.children, code) : null;
    if (below) return [node, ...below];
  }
  return null;
}

// The storefront's default listing: the first root category of the current catalog, or the
// homepage when the catalog has no categories at all. The header's Products tab and the
// catalog-switch fallback both point here, so they cannot name different destinations.
export function defaultListingPath(categories: ICategoryNode[]): string {
  return categories.length > 0 ? `/category/${categories[0].id}` : '/';
}

// The category path to show for a product. A product document carries every category it is
// assigned to, ancestors included and in no useful order (`source.category`, ids only for the
// root), so "which one is the page's parent" has to be decided here: the deepest one, i.e. the
// assignment with the longest ancestor chain. Ties keep the first, which is the order the index
// returns.
// `source` is the raw _source, so it only exists where PRODUCT_DETAIL_FIELDS was requested —
// the PDP on both the server and the client pass. Anywhere else this correctly returns [].
export function productCategoryTrail(
  nodes: ICategoryNode[],
  source: Record<string, any> | undefined
): ICategoryNode[] {
  const assigned = Array.isArray(source?.category) ? source!.category : [];
  // fetchCategoryTree() returns the root first, as a childless entry — the same place the rest
  // of the app looks for it (Homepage's "Trending Now", ProductPage's recommendations).
  const rootId = nodes.length > 0 ? String(nodes[0].id) : null;
  let deepest: ICategoryNode[] = [];
  let rootOnly: ICategoryNode[] = [];

  for (const entry of assigned) {
    const id = entry?.id;
    if (!id) continue;
    const trail = findTrail(nodes, String(id));
    if (!trail) continue;
    // Every product is assigned to the root, and "Default Category" names nothing a visitor
    // recognises, so it is held back as a fallback rather than compared on depth. It would
    // otherwise win any tie against a top-level category — which is one node deep too, since
    // the flattening above lifts the root's children to the top — and that is exactly the
    // common case: a dress assigned to the root and to Dresses read "Home / Default Category".
    if (trail.length === 1 && String(trail[0].id) === rootId) {
      rootOnly = trail;
      continue;
    }
    if (trail.length > deepest.length) deepest = trail;
  }

  return deepest.length > 0 ? deepest : rootOnly;
}
