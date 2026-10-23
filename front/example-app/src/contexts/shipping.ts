// The one shipping rule, shared by the cart and the checkout so both show the same total
// (specs/bugfix-checkout-total-without-shipping.md).
export const FREE_SHIPPING_THRESHOLD = 180
export const SHIPPING_FEE = 4.9

export function cartShipping(subtotal: number) {
  const free = subtotal >= FREE_SHIPPING_THRESHOLD
  const fee = free ? 0 : SHIPPING_FEE
  return {
    free,
    fee,
    total: subtotal + fee,
    remaining: Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0),
    progress: Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100),
  }
}
