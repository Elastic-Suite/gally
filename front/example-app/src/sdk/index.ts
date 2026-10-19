import {
  Client,
  Configuration,
  RecommenderManager,
  SearchManager,
  TrackingEventManager,
  TrackingEventType,
} from '@elastic-suite/gally-sdk/browser'

// The browser reaches the API through the public proxy. Node cannot: inside the
// `example` container `gally.localhost` resolves to 127.0.0.1, where nothing listens,
// so a server-side fetch dies with ECONNREFUSED. On the compose network the router
// container serves the same API over plain HTTP, which is what server components use.
//
// Server side, the URL is read from the container env on each call. Browser side, the app
// and the API share the same proxy, so the page's own origin is the default.
// NEXT_PUBLIC_GALLY_API_URL overrides it when the API lives elsewhere, but Next writes it
// into the bundle at build time (at `next dev` start in dev), so it must stay literal here.
export function getBaseUri(): string {
  if (typeof window === 'undefined') {
    return process.env.GALLY_INTERNAL_API_URL || 'http://router/api'
  }
  return (
    process.env.NEXT_PUBLIC_GALLY_API_URL || `${window.location.origin}/api`
  )
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
