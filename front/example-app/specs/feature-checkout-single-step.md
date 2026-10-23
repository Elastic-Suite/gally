# Feature: checkout in one step, prefilled with a demo customer

## Status: implemented

## Page/Component: src/views/CheckoutPage.tsx

The checkout tunnel had two form steps - shipping, then payment - before the confirmation. For a
demo that is one click of friction and six empty fields to type into. Delivery and payment now sit
on one step, and every field is prefilled with a demo customer, John Doe, so the order can be
placed in one click.

## Behaviour (testable)

-   [x] The stepper shows three steps: Cart (done), Delivery & payment (active), Confirmation.
-   [ ] The one form step holds the shipping fields, then the payment fields, then the total and the
        place-order button.
-   [x] Every field is prefilled: John / Doe / john.doe@example.com / 1 Main Street / Springfield /
        12345 / 4242 4242 4242 4242 / 12/30 / 123. The values stay editable (`defaultValue`, not
        `value`).
-   [ ] The placeholders still show when a field is cleared.
-   [x] Place order moves to the confirmation step and empties the cart.
-   [ ] The step label is translated in en, fr and de (`cart.checkout.steps.details`).

Ticked lines checked by `src/test/cart-checkout.test.tsx`; the field order, the cleared-field
placeholder and the fr / de step label are not.

## SDK contract used

-   None. The page does not query Gally.

## Tracking (required)

-   `trackOrder` fires once on place order, with the order id, the total and the cart lines - as
    before. Since `bugfix-checkout-total-without-shipping.md` the total includes shipping.

## UI constraints

-   Same card, input and button idioms as before (`facet-search`, `btn-coral`, `cart-summary`). No
    new token, no new primitive.
-   The demo values are not translated: they are data, not interface text.

## MUST NOT change

-   The `trackOrder` call and its payload (the total includes shipping, see
    `bugfix-checkout-total-without-shipping.md`).
-   `clearCart()` after the order is placed.
-   The coral place-order button (`specs/feature-add-to-cart-indigo.md`).
-   The German `MM/JJ` expiry placeholder (`specs/bugfix-german-locale-untranslated.md`).
