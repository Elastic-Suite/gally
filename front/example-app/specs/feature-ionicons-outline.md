# Feature: one icon set - ionicons outline

## Status: implemented

## Page/Component: src/components/Icon.tsx (new), every component that drew an emoji, a text glyph or its own inline SVG as an icon

Icons are ionicons in the outline style. Before this change the
storefront mixed emoji (🔍 📊 🧠), text glyphs (✕ ✓ ← ☰ −), one hand-written SVG per component
(header cart, image placeholder) and a CSS `content: '✓ '`. Emoji render differently on each OS
and could not take the text colour.

## Behaviour (testable)

- [x] `<Icon name="..." />` renders an ionicons **outline** icon as a `currentColor` mask, sized `1em`, `aria-hidden`.
- [x] No translation string in `src/locales/{en,fr,de}/` starts with an icon glyph. The component adds the `<Icon>` before the text.
- [x] These surfaces show the ionicon, seen on screenshots of the running app: search field, search overlay prompt and section titles, header cart, filter chips, cart remove and quantity, pagination, Filters button, product stock / wishlist / added, facet show more / less, Insights panel and button, closing page headings and consequences, pricing checklist.
- [ ] These other surfaces are converted too: Explain page, Explain panel, Insights event icons, event log, blog card fallback, vector search empty and error states, checkout steps and confirmation, story companion, story toast. Code changed and `tsc` passes, but **not seen on screen**. The Explain panel cannot be opened at all: `SearchExplain.tsx` compares `pathname` with `/search`, and the pathname carries the locale segment.
- [x] Icon-only buttons (close, remove, quantity, pagination) keep an accessible name: a visually hidden label, in all three locales (`common:actions.close` / `remove` / `decrease` / `increase`). Checked in the markup, not with a screen reader.
- [x] `Pagination` draws chevrons itself; `prevLabel` / `nextLabel` are its accessible names.

## Glyph to icon mapping

🔍 `search` · 📁 `folder-open` · 📝 `document-text` · ✓ `checkmark` · ✕ `close` · ♡ `heart` ·
← `arrow-back` · → `arrow-forward` · − `remove` · + `add` · 📖 `book` · 📊 `stats-chart` ·
⏱ `time` · 💰 `wallet` · 📋 `list` · 🧠 `bulb` · 🚀 `rocket` · 📐 `git-compare` · 🔴 `radio-button-on` ·
🛒 `cart` · ☰ `options` · 👁 `eye` · 💡 `bulb` · ✎ `create` · ⚠ `warning` · pagination `chevron-back` / `chevron-forward` ·
image placeholder `image`.

## Traps found while implementing

- **`ionicons/icons` outline SVGs carry no fill or stroke attributes.** Their paths use the classes `ionicon-fill-none` and `ionicon-stroke-width`, styled only inside the `<ion-icon>` web component. Used as a mask as they are, outlines render as filled blobs and stroke-only icons (close, add, remove) render as nothing. `Icon.tsx` adds those rules to each SVG. The files in `ionicons/dist/svg/` do have the attributes.
- **`.icon` sits after most component rules in `styles.css`.** A one-class rule that sizes an icon (`.cart-icon`) loses to it; write it with two classes (`.cart-badge .cart-icon`).

## SDK contract used

- None. Presentation only.

## Tracking (required)

- Unchanged. Search, page view, product view, add-to-cart and order events fire exactly as before.

## UI constraints

- Icons come only from `ionicons/icons` through `Icon.tsx`. No emoji, no text glyph and no inline SVG as an icon in new UI.
- Size follows the font size (`1em`); colour follows the text (`currentColor`). No new px or hex.
- `ionicons` 6.0.3, the version the admin (`front/pwa`) already uses, declared in `example-app/package.json`.

## MUST NOT change

- Sort options keep their text arrows (`Prix ↑`, `Nom A→Z`): a `<select>` option cannot hold an element.
- The `−40%` closing stat and trailing arrows on links (`Et côté budget ? →`) stay text.
- The header cart keeps its label as visually hidden text and the count after it (`feature-header-light-two-row.md`).
- Tracking calls and their payloads.
- The Explain page's hardcoded French text stays as it is; translating it is a separate change.
