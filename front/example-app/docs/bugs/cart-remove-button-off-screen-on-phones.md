# Cart remove button goes off screen on phones

## Status: open (bug)

## Observed

At 360px and 390px wide, the right edge of the cart line's remove button sits at 411px. The cart
page scrolls sideways.

## Still works

The button stays round, 32x32, even with a long product name. Removing a line works, and the
change survives a reload.

## Source

`bugfix-cart-remove-button-round.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-cart-remove-button-round.md`).
