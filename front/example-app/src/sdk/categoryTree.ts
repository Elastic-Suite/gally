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
