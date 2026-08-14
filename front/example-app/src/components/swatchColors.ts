// Label-to-hex approximation for colour swatches, shared by the colour facet (./Facets.tsx)
// and the PDP option selector (../views/ProductPage.tsx).
//
// Keyed on the *label*, which means it is language-dependent — and the storefront lands on
// `com_fr`, so the French labels are the ones that matter most. They were missing: every one of
// the demo catalogue's 13 `fashion_color` options (Pluie, Menthe, Lila, Pêche, Kaki, Doré…) fell
// through to the hash-based hue below, which is why the facet swatches showed arbitrary colours
// on the default catalogue. Both languages are listed for each option now.
//
// Keying on the source-field option value instead would be locale-proof, but the ids are per
// source catalogue — Luma's `color` has its own 12 options whose ids collide with
// `fashion_color`'s — so it would need a table per attribute code. More machinery than a demo
// storefront earns.
export const SWATCH_COLORS: Record<string, string> = {
  black: '#222', white: '#fff', red: '#e53935', blue: '#1e88e5',
  green: '#43a047', yellow: '#fdd835', pink: '#ec407a', brown: '#6d4c41',
  gray: '#9e9e9e', grey: '#9e9e9e', orange: '#ff9800', purple: '#7b1fa2',
  gold: '#ffd700', silver: '#c0c0c0', beige: '#f5f5dc', navy: '#001f3f',
  coral: '#ff6b6b', cream: '#fffdd0', ivory: '#fffff0', khaki: '#c3b091',
  lavender: '#b57edc', lime: '#cddc39', magenta: '#e91e63', maroon: '#800000',
  mint: '#98ff98', olive: '#808000', peach: '#ffcba4', plum: '#8e4585',
  rose: '#ff007f', rust: '#b7410e', salmon: '#fa8072', teal: '#008080',
  turquoise: '#40e0d0', violet: '#7f00ff', wine: '#722f37', tan: '#d2b48c',
  charcoal: '#36454f', burgundy: '#800020', taupe: '#483c32', nude: '#f2d2bd',
  aqua: '#00ffff', indigo: '#4b0082', chocolate: '#7b3f00', camel: '#c19a6b',
  blush: '#de5d83', champagne: '#f7e7ce', copper: '#b87333', denim: '#1560bd',
  emerald: '#50c878', fuchsia: '#ff00ff', garnet: '#733635', jade: '#00a86b',
  lemon: '#fff44f', lilac: '#c8a2c8', mauve: '#e0b0ff', mustard: '#ffdb58',
  opal: '#a8c3bc', pewter: '#8e9196', ruby: '#e0115f', sage: '#bcb88a',
  sapphire: '#0f52ba', scarlet: '#ff2400', slate: '#708090', stone: '#928e85',
  'off white': '#faf9f6', 'off-white': '#faf9f6', 'light blue': '#add8e6',
  'light green': '#90ee90', 'light pink': '#ffb6c1', 'light gray': '#d3d3d3',
  'dark blue': '#00008b', 'dark green': '#006400', 'dark red': '#8b0000',
  'dark gray': '#a9a9a9', 'dark grey': '#a9a9a9',
  multi: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
  multicolor: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',

  // The demo catalogue's own palette (`fashion_color`), French labels plus the English ones
  // this map did not already cover. `rain` and `lily` are Venia colour names rather than
  // colour words, so they get a deliberate approximation.
  doré: '#ffd700', dore: '#ffd700',
  argent: '#c0c0c0',
  pêche: '#ffcba4', peche: '#ffcba4',
  kaki: '#c3b091',
  lila: '#c8a2c8',
  pluie: '#8ca3b8', rain: '#8ca3b8',
  menthe: '#98ff98',
  lily: '#f4ead5',
  latte: '#c8a887',
  coco: '#7b4b32', cocoa: '#7b4b32',
  noir: '#222',
  gris: '#9e9e9e',
};

// A label the map does not know still has to render as *something* stable, so it gets a hue
// hashed from the label: arbitrary, but the same arbitrary colour on every render and on both
// the server and client passes.
export function guessColor(label: string): string {
  const lower = label.toLowerCase().trim();
  // Direct match
  if (SWATCH_COLORS[lower]) return SWATCH_COLORS[lower];
  // Partial match — check if any key is contained in the label
  for (const [key, val] of Object.entries(SWATCH_COLORS)) {
    if (lower.includes(key)) return val;
  }
  // Fallback: use a hash-based hue
  let hash = 0;
  for (let i = 0; i < lower.length; i++) hash = lower.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 55%)`;
}

// Near-white swatches need an outline or they vanish against the card. Same test the colour
// facet has always applied, lifted here so both callers agree on it.
export function needsSwatchOutline(label: string): boolean {
  const lower = label.toLowerCase().trim();
  return lower === 'white' || lower === 'blanc';
}
