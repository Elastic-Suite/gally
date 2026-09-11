# Feature: the quick-add panel is a bottom band, not a full cover

## Status: implemented
## Page/Component: src/styles.css only — `.quick-add` and its card-scoped rules.
Rendered by src/components/QuickAdd.tsx inside src/components/ProductCard.tsx, which are both
unchanged. Supersedes the full-cover geometry set by `feature-quick-add-overlay.md`; everything
else in that spec still holds.

## Problem

`.quick-add` was `inset: 0` — it filled the whole picture. That was the right call when the
picture was 180px tall and the panel needed every pixel of it to fit two axis rows and a button.

`feature-larger-product-grid.md` then raised `--product-card-image-height` to 300px on the listing
grid. The panel's content did not grow with it, so hovering a card now blurs out a 300px photo to
show at most two rows of chips and one button, with the two `margin-top: auto` rules spreading
them across empty space. The merchandising the listing exists to show disappears at exactly the
moment the visitor reaches for it.

The wrong belief is not in the CSS, it is in the coupling: the panel was sized against its
container because at 180px the two were the same thing. They stopped being the same thing and
nothing said so.

## Behaviour (testable)

- [ ] The panel is anchored to the bottom edge of the picture and is only as tall as its content.
      A simple product's band is one button plus padding; a two-axis configurable's is two chip
      rows plus the button.
- [ ] The top of the product photo is not covered or blurred on hover.
- [ ] The add buttons still line up horizontally across a grid row when a simple card sits beside
      a two-axis configurable. This no longer comes from `margin-top: auto` — it comes from the
      anchoring: every band's bottom edge is its own picture's bottom edge.
- [ ] At rest the band is still invisible, click-through and clipped: `opacity: 0`,
      `pointer-events: none`, parked at `translateY(100%)` below the picture where
      `.product-card-image`'s `overflow: hidden` cuts it off. It never reaches the name or price.
- [ ] `:hover` and `:focus-within` both still reveal it, and the chips are keyboard reachable.
- [ ] The home carousel (`ProductSlider`, outside `.products-grid`, so a 180px picture) still
      works: the band caps at the picture height and scrolls rather than escaping upward.
- [ ] The autocomplete row is pixel-identical to before. It is not an overlay there.
- [ ] Touch (`@media (hover: none)`) is unchanged: the band rests open, opaque, no blur.
- [ ] `npx tsc --noEmit` clean in the `example` container; dev server compiles with no `⨯`.

## SDK contract used

None. No query, no `selectedFields`, no page size. Stylesheet only.

## Tracking (required)

Unchanged. `ADD_TO_CART` still fires from `CartContext.addToCart` via the same button, with the
parent SKU and the chosen labels as `variant`. No event added, removed or moved.

## UI constraints

- `inset: auto 0 0 0` replaces `inset: 0`. Left, right and bottom pinned; `top: auto` is what
  lets the height come from the content.
- `max-height: 100%` is card-scoped (`.product-card-image .quick-add`), not on the base class.
  On the base it would also land on the autocomplete's in-flow panel, whose containing block is
  auto-height — a percentage there resolves to nothing useful and is not worth reasoning about.
  Scoped, the ACP is provably untouched.
- The two `margin-top: auto` rules are deleted. A content-height panel has no free space to
  distribute, so they were dead the moment the panel stopped filling the picture.
- Still translucent and blurred, not opaque: `--scrim-light` over `backdrop-filter: blur(6px)`.
  The band is short enough that an opaque white would have been defensible, but the blur is what
  keeps the chips legible over arbitrary photography and the ACP uses the same pair. One idiom.
- No new token, no raw hex, px or font-size. Every value added is a layout keyword.

## MUST NOT change

- **`.product-card-image` must keep `overflow: hidden`.** `feature-quick-add-overlay.md` named two
  independent guards against the panel landing on the name and price: the panel being exactly its
  container, and this clip. **This change removes the first one.** The band is parked a full band
  height *below* the picture at rest, and the clip is now the only thing containing it.
  `opacity: 0` and `pointer-events: none` remain as the second and third defences, but they hide
  and disarm it — they do not contain it.
- **`pointer-events: none` at rest, never `visibility: hidden`** — the latter takes the panel out
  of the tab order and `:focus-within` can then never fire.
- **`max-height` stays scoped to `.product-card-image`.** Do not "tidy" it onto `.quick-add`.
- **`-webkit-backdrop-filter` stays declared before the standard property**
  (`bugfix-acp-scrim-blur-dropped.md`).
- **`.autocomplete-product .quick-add` is untouched.** It sets `position: static` / `inset: auto`
  and never reads the card geometry; keep it that way.
- **`.quick-add-button:disabled` stays declared before `.btn.added`**, and
  `.quick-add-button:disabled:not(.added):hover` keeps both pseudo-classes — see the
  disabled-hover trap in `feature-quick-add-overlay.md`.
- No JSX change. In particular the `<Link>` keeps wrapping only the picture, not the
  `.product-card-image` box.
