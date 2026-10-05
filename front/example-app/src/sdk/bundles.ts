import { BASE_URI } from './index';

// The extra bundles installed on the Gally API, such as GallyTermSuggestionBundle. The SDK
// needs them to know which optional fields it may ask for: requesting `termSuggestions` from an
// API without that bundle fails the whole query.
//
// The list only changes when the API is redeployed, so it is fetched once per Node process and
// kept for as long as the Next server runs. A failed fetch is not kept, so the next request
// tries again instead of running without bundles until a restart.
let bundlesPromise: Promise<string[]> | null = null;

export function fetchBundles(): Promise<string[]> {
  if (!bundlesPromise) {
    bundlesPromise = requestBundles().catch(() => {
      bundlesPromise = null;
      return [];
    });
  }
  return bundlesPromise;
}

async function requestBundles(): Promise<string[]> {
  const res = await fetch(`${BASE_URI}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ extraBundles { name } }' }),
  });
  if (!res.ok) throw new Error(`extraBundles: HTTP ${res.status}`);
  const data = await res.json();
  return (data?.data?.extraBundles || []).map((bundle: { name: string }) => bundle.name);
}
