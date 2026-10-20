import {
  Client,
  Configuration,
  RecommenderManager,
  SearchManager,
  TrackingEventManager,
  TrackingEventType,
} from '@elastic-suite/gally-sdk/browser'

// The API URL for fetching. Media and page URLs never come from here: images use the media base
// from the public configuration, pages use SITE in ./seo.
//
// NEXT_PUBLIC_API_URL is the public URL, used by the browser. Next writes it into the bundles
// when it builds (at `next dev` start in dev), so it must stay literal here.
// SSR_API_URL is an optional URL for server-side calls only, read at runtime. Locally it is
// http://router/api, because gally.localhost is 127.0.0.1 inside the container. Without it the
// server calls the public URL too (int reaches it through extra_hosts).
export function getBaseUri(): string {
  const publicUri =
    process.env.NEXT_PUBLIC_API_URL || 'https://gally.localhost/api'
  if (typeof window === 'undefined') {
    return process.env.SSR_API_URL || publicUri
  }
  return publicUri
}

// Client singleton (for direct GraphQL/REST calls)
let clientInstance: Client | null = null

export function getClient(): Client {
  if (!clientInstance) {
    clientInstance = new Client(new Configuration({ baseUri: getBaseUri() }))
  }

  return clientInstance
}

// Search Manager singleton
let searchManagerInstance: SearchManager | null = null

// The bundles installed on the API, fetched on the server (see ./bundles.ts) and handed over by
// app/providers.tsx. The SearchManager reads them to decide which optional fields it may request,
// such as `termSuggestions`. A different list drops the singleton so the next call rebuilds it.
let bundles: string[] = []

export function setBundles(next: string[]): void {
  if (next.join() === bundles.join()) return
  bundles = next
  searchManagerInstance = null
}

export function getSearchManager(): SearchManager {
  if (!searchManagerInstance) {
    searchManagerInstance = new SearchManager({
      baseUri: getBaseUri(),
      bundles,
    })
  }
  return searchManagerInstance
}

// Recommender Manager singleton (premium Recommender module)
let recommenderManagerInstance: RecommenderManager | null = null

export function getRecommenderManager(): RecommenderManager {
  if (!recommenderManagerInstance) {
    recommenderManagerInstance = new RecommenderManager({
      baseUri: getBaseUri(),
    })
  }
  return recommenderManagerInstance
}

// Tracking Manager singleton
let trackerInstance: ReturnType<typeof TrackingEventManager.init> | null = null

export function getTracker(): TrackingEventManager {
  if (!trackerInstance) {
    trackerInstance = TrackingEventManager.init({ baseUri: getBaseUri() })
  }
  return trackerInstance
}

export { TrackingEventType }
