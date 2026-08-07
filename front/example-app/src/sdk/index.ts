import { Client, Configuration, SearchManager, TrackingEventManager, TrackingEventType } from '@elastic-suite/gally-sdk/browser';

// The browser reaches the API through the public proxy. Node cannot: inside the
// `example` container `gally.localhost` resolves to 127.0.0.1, where nothing listens,
// so a server-side fetch dies with ECONNREFUSED. On the compose network the router
// container serves the same API over plain HTTP, which is what server components use.
// Overridable so this is not pinned to the local stack, but the default keeps docker
// and compose untouched.
const PUBLIC_BASE_URI = 'https://gally.localhost/api';
const INTERNAL_BASE_URI = process.env.GALLY_INTERNAL_API_URL || 'http://router/api';

const BASE_URI =
  typeof window === 'undefined' ? INTERNAL_BASE_URI : PUBLIC_BASE_URI;
export const MEDIA_BASE_URL = 'https://gally.localhost/media/catalog/product';

// Configuration singleton
const config = new Configuration({ baseUri: BASE_URI });

// Client singleton (for direct GraphQL/REST calls)
let clientInstance: Client | null = null;

export function getClient(): Client {
  if (!clientInstance) {
    clientInstance = new Client(config);
  }
  return clientInstance;
}

// Search Manager singleton
let searchManagerInstance: SearchManager | null = null;

export function getSearchManager(): SearchManager {
  if (!searchManagerInstance) {
    searchManagerInstance = new SearchManager({ baseUri: BASE_URI });
  }
  return searchManagerInstance;
}

// Tracking Manager singleton
let trackerInstance: ReturnType<typeof TrackingEventManager.init> | null = null;

export function getTracker(): TrackingEventManager {
  if (!trackerInstance) {
    trackerInstance = TrackingEventManager.init({ baseUri: BASE_URI });
  }
  return trackerInstance;
}

export { TrackingEventType };
export { BASE_URI };
