import { BASE_URI } from './index';
import { axisCodes } from './fields';

// Translated headings for the configurable axes, straight from the catalogue.
//
// `product_source_field_labels` is public — no token — and takes an explicit list of source-field
// codes plus a localized-catalog code. It deliberately has no "list everything" mode, so the code
// list has to be sent: that is this catalogue's axes, the same ones that build its GraphQL
// selection.
//
// No React here, by design. This module is imported by app/[locale]/layout.tsx, which is a server
// component, and a server component cannot import anything that reaches a hook.

export type AxisLabels = Record<string, string>;

// An unknown code comes back as ucfirst(code) rather than an error, which is what the endpoint
// does for a real source field with no label too — so a missing axis degrades to a readable
// heading instead of a blank one, and the response never says which codes exist.
export async function fetchAxisLabels(
  localizedCatalogCode: string,
  catalogCode: string,
): Promise<AxisLabels> {
  const codes = axisCodes(catalogCode);
  if (codes.length === 0) return {};
  const params = new URLSearchParams();
  for (const code of codes) params.append('codes[]', code);
  params.set('localizedCatalog', localizedCatalogCode);

  try {
    const res = await fetch(`${BASE_URI}/product_source_field_labels?${params}`, {
      headers: { Accept: 'application/ld+json' },
    });
    if (!res.ok) return {};
    const data = await res.json();
    const labels: AxisLabels = {};
    for (const entry of data['hydra:member'] || []) {
      if (entry?.code) labels[entry.code] = String(entry.label ?? entry.code);
    }
    return labels;
  } catch {
    // A heading is not worth a 500. Falling back to {} makes axisLabel() humanise the code,
    // which is the same string the endpoint itself would have returned for an unknown one.
    return {};
  }
}

// Turns `fio_clothing_size` into `Fio_clothing_size`. Matches the API's own fallback for a code
// it does not know, so a failed fetch and an unlabelled field look identical rather than leaking
// which of the two happened.
export function humanizeAxisCode(code: string): string {
  return code.charAt(0).toUpperCase() + code.slice(1);
}

export function axisLabel(labels: AxisLabels, code: string): string {
  return labels[code] || humanizeAxisCode(code);
}
