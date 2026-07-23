import type { Country, Locale } from '../data/types'

interface CountryPricing {
  currency: string
  /** Illustrative conversion rate from the catalog's base EUR price. Mockup only. */
  rate: number
}

const COUNTRY_PRICING: Record<Country, CountryPricing> = {
  FR: { currency: 'EUR', rate: 1 },
  DE: { currency: 'EUR', rate: 1 },
  GB: { currency: 'GBP', rate: 0.85 },
  US: { currency: 'USD', rate: 1.08 },
}

function priceFormatter(country: Country, locale: Locale): Intl.NumberFormat {
  const { currency } = COUNTRY_PRICING[country]
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency,
  })
}

export function formatPrice(
  basePrice: number,
  country: Country,
  locale: Locale,
): string {
  const { rate } = COUNTRY_PRICING[country]
  return priceFormatter(country, locale).format(basePrice * rate)
}
