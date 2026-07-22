import { SearchManager, TrackingEventManager, TrackingEventType, Client, Configuration } from '@elastic-suite/gally-sdk';

const BASE_URI = 'https://gally.localhost/api';
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
