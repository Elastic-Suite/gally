import { notFound, redirect } from 'next/navigation';
import { IResolvedCatalog } from './catalogs';
import { defaultListingPath } from './categoryTree';
import { resolveLocale, cachedCategoryTree } from './server';

// Server-only. What to do when a category id, a SKU or a blog article id names nothing in this
// catalog.
//
// Switching catalog keeps the visitor on the same page — /papershop_fr/category/cat_2 becomes
// /fashion_fr/category/cat_2 — but those ids belong to one catalog, so the target usually does
// not exist and the route used to answer 404. That is the wrong answer to "show me the other
// catalog": the page did not disappear, it moved.
//
// So the switch marks its own navigation with `?from=<previous catalog>`
// (src/contexts/CatalogContext.tsx) and this decides between the two cases:
//   marked and valid -> 307 to the new catalog's fallback for that section
//   anything else    -> a real 404, as before
//
// The mark is validated against the catalog list on every call. Without that, appending
// `?from=whatever` to any junk URL would turn a 404 into a 200 somewhere else — the soft-404
// that specs/feature-locale-segment-phase2.md forbids.
//
// See specs/feature-catalog-switch-missing-target.md, which also records why this is not a
// not-found.tsx boundary.

export const SWITCH_PARAM = 'from';

export type RouteSearchParams = Record<string, string | string[] | undefined>;

export async function missingInCatalog(
  locale: string,
  resolved: IResolvedCatalog,
  searchParams: RouteSearchParams | undefined,
  // Where to send the visitor, without the locale segment. Category and product omit it and get
  // this catalog's default listing; the blog passes '/blog', because dropping someone reading an
  // article into a product grid changes section on them. Passing it also skips the tree fetch.
  fallbackPath?: string
): Promise<never> {
  const raw = searchParams?.[SWITCH_PARAM];
  const from = Array.isArray(raw) ? raw[0] : raw;

  // resolveLocale is cache()d and the catalog list is already in memory for this request, so
  // checking the mark costs no extra call.
  if (from && from !== locale && (await resolveLocale(from))) {
    if (fallbackPath) redirect(`/${locale}${fallbackPath}`);
    const tree = await cachedCategoryTree(resolved.catalog.id, resolved.localizedCatalog.id);
    redirect(`/${locale}${defaultListingPath(tree)}`);
  }

  notFound();
}
