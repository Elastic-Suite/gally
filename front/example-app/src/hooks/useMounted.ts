import { useEffect, useState } from 'react';

// `false` on the server and on the very first client render, `true` from the
// first effect on. That ordering is the whole point: both sides render the same
// thing on pass one, so gating on it never causes a hydration mismatch.
//
// Use it for anything that must exist only in the browser — a `createPortal`
// target, or UI deliberately kept out of the server payload. It is the
// SSR-safe alternative to `next/dynamic`'s `ssr: false`, which implements the
// same intent by *throwing* `BailoutToCSR` during the server render; see
// specs/bugfix-dynamic-ssr-false-bailout.md for why that mattered here.
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
