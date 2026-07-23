import { useState } from 'react'
import { getCookie, setCookie } from './cookies'

const RATINGS_COOKIE = 'gally_ratings'
/** Share of products that show a rating at all; the rest display none. */
const RATING_COVERAGE = 0.6
const MIN_RATING = 3
const MAX_RATING = 5
/** Sentinel stored for a sku that was rolled to have no rating, so we don't re-roll it. */
const NO_RATING = 0

function readRatings(): Record<string, number> {
  const raw = getCookie(RATINGS_COOKIE)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeRatings(ratings: Record<string, number>): void {
  setCookie(RATINGS_COOKIE, JSON.stringify(ratings))
}

/** Returns this session's rating (3-5) for a product, or null if it has none. Decided once, then persisted in a cookie. */
function getOrAssignRating(sku: string): number | null {
  const ratings = readRatings()
  if (sku in ratings) return ratings[sku] || null

  const hasRating = Math.random() < RATING_COVERAGE
  const value = hasRating
    ? MIN_RATING + Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1))
    : NO_RATING
  writeRatings({ ...ratings, [sku]: value })
  return value || null
}

export function useProductRating(sku: string): number | null {
  const [rating] = useState(() => getOrAssignRating(sku))
  return rating
}
