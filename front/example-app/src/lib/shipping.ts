import type { Country } from '../data/types'

/** Illustrative flat shipping fees per country, plus a small per-extra-item charge. Mockup only. */
const SHIPPING_BASE_FEE: Record<Country, number> = {
  FR: 4.9,
  DE: 5.9,
  GB: 7.9,
  US: 12.9,
}

export function estimateShippingCost(
  country: Country,
  itemCount: number,
): number {
  return SHIPPING_BASE_FEE[country] + Math.max(0, itemCount - 1) * 1.5
}
