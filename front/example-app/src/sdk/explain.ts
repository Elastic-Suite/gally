// The explain query is admin-only: it needs a JWT from /authentication_token. The storefront
// used to log in with hardcoded admin credentials, which shipped them in the browser bundle.
// Explain stays off until the token comes from the server instead, for example a route handler
// that reads the credentials from the env. Turn this flag on together with a real
// getExplainToken().
export const EXPLAIN_ENABLED = false

export function getExplainToken(): Promise<string> {
  return Promise.reject(new Error('Explain is disabled'))
}
