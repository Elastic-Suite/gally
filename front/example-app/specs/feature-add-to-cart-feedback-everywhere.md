# Feature: add-to-cart confirms in place everywhere (+ ACP scrim readability)

## Status: implemented
## Page/Component: src/hooks/useAddedFlash.ts (new), src/components/ProductCard.tsx, src/components/SearchOverlay.tsx, src/views/ProductPage.tsx, src/styles.css

## Context
Two cosmetic follow-ups after the SSR phases. They ship together because both are about the
autocomplete panel being the only place in the app that got a treatment the rest should have had.

## Behaviour (testable)

### ACP scrim: readable again
- [x] `.search-overlay-scrim` went `rgba(30,27,75,.55)` / `blur(20px)` →
      `rgba(30,27,75,.72)` / `blur(28px)` (both the prefixed and unprefixed
      `backdrop-filter`). Nothing else in the overlay changed.
- [x] The reason it needed raising is recorded in the rule's comment: after
      `feature-acp-visual-redesign.md` merged the two surfaces, `.search-overlay-panel` owns no
      background at all, so the scrim is the *only* ground the panel's `rgba(255,255,255,.92)` text
      ever gets. At `.55` a dense category grid still read through the columns.
- [x] Checked first that the value had not regressed on its own: `git log -L '/^\.search-overlay-scrim {/,/^}/'`
      shows it only ever moved `8px → 20px`. What was "reduced" was the panel's second layer, not
      this number — worth knowing before hunting for a bad commit.
- [x] `.header-search-band`'s `rgba(250,250,250,.96)` + `blur(20px)` overlay-open treatment is
      untouched; its alpha was tuned against the band's own opacity, not the scrim's.

### One shared confirmation timer
- [x] New `src/hooks/useAddedFlash.ts`: `useAddedFlash(duration = ADDED_FLASH_MS /* 1600 */)` returns
      `{ addedKey, flash }`. State + `useRef` timer + unmount cleanup, and `flash()` restarts the
      timer so re-adding the same product replays the confirmation instead of being cut short by the
      first timeout.
- [x] This is the logic lifted verbatim out of `SearchOverlay.tsx`'s `ProductsColumn`, which now
      consumes the hook — extracted rather than copied a third time (golden rule 3). ACP behaviour is
      byte-identical: same 1600ms, same `justAdded` computation, same markup.

### The feedback now fires in all three places
- [x] `SearchOverlay.tsx` (autocomplete product card) — unchanged behaviour, new implementation.
- [x] `ProductCard.tsx` (grid card, everywhere a product list renders: category, search, sliders) —
      card takes `.just-added` and plays the green `addedFlash` glow; button takes `.added`, turns
      `--success`, and its label swaps to `product:card.added` for 1.6s.
- [x] `ProductPage.tsx` (detail page, `btn-lg`) — button-only confirmation, keyed on `p.sku`.
      **Deliberately no card flash**: `addedFlash` is an outline/box-shadow glow that traces a card
      border, and the detail layout has no card to trace.
- [x] Out-of-stock keeps priority over the added label in all three: the ternary tests
      `!stock.status` first, and the button is `disabled`, so `flash()` is unreachable anyway.

### CSS: one confirmation rule, not three
- [x] New shared `.btn.added { background: var(--success); color: white }`, declared **after**
      `.btn-primary:hover`. At (0,2,0) it only *ties* with that hover rule, so source order is what
      decides — declared earlier, the confirmation would disappear for as long as the pointer stayed
      on the button you just clicked. The comment in `styles.css` says so.
- [x] The ACP's own `.autocomplete-item.autocomplete-product .autocomplete-add-to-cart.added` (0,4,0)
      kept only what is ACP-specific — `opacity: 1` (beats the card-hover fade, (0,3,0)) and
      `transform: none` (beats the button's own `:hover` scale). Its `background` moved to the shared
      rule; the four-class selector still exists and is still load-bearing for the other two.
- [x] `.product-card.just-added` reuses the existing `addedFlash` keyframes, right beside
      `.product-card.story-added`, which already played them for the guided story. No new keyframes.
      Being an animation it outranks `.product-card:hover`'s `box-shadow` for its whole duration.

## SDK contract used
- None. Presentation only — no `addToCart()` call gained or lost an argument, no query changed.

## Tracking (required)
- Unchanged. `ADD_TO_CART` still fires from `useCart().addToCart()` at all three call sites; `flash()`
  is called *after* it and touches nothing but local state. Dropping either call would be a rule-4
  regression.

## i18n
- No new keys. `product:card.added` (`✓ Added` / `✓ Ajouté`) already existed for the ACP and is
  reused; `ProductPage.tsx` already loads the `product` namespace, so `t('card.added')` resolves
  there without a `page.added` duplicate.
- `src/locales/de/product.json` carried English text for `card.addToCart` and `card.added`. That
  turned out to hold for the entire German bundle; fixed separately in
  `specs/bugfix-german-locale-untranslated.md`, so `card.added` now renders `✓ Hinzugefügt`.

## UI constraints
- No new token, hex, px or font-size. `--success` and `addedFlash` both already existed.
- No new visual primitive — the confirmation is the ACP's, generalized.

## Verified
- `npx tsc --noEmit` in the `example` container: clean.
- `docker compose logs example`: `✓ Compiled`, no `⨯`. `/example/com_fr/product/VP01` and
  `/example/com_fr/category/cat_2` both 200 after the change.
- Not verified by a human eye in a browser at time of writing: the exact scrim darkness and the
  flash timing on the grid. Both are single-value tunings if they read wrong.

## MUST NOT change
- **`.btn.added` must stay declared after `.btn-primary:hover`.** Moving it up the file, or
  reordering the buttons section, silently breaks the confirmation under the pointer — the failure is
  invisible unless you keep the mouse on the button.
- The ACP's four-class `.added` selector and its `opacity`/`transform` overrides. They beat
  ACP-only rules that the shared `.btn.added` does not address.
- `:disabled` still winning for out-of-stock — `.autocomplete-add-to-cart:disabled`'s `--gray-400`
  must not be overridden by the success green.
- The detail page staying flash-free. The glow was tried mentally against that layout and rejected;
  adding it back means re-deciding, not restoring.
- The scrim being the only blurred surface. Giving `.search-overlay-panel` a background again
  reverts `feature-acp-visual-redesign.md`'s core decision and makes this scrim value wrong.
