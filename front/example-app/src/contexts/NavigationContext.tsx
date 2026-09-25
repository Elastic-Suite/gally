'use client';

import {
  createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState,
  useTransition,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLinkStatus } from 'next/link';

// Navigation feedback for routes that fetch on the server.
//
// This used to be Next's job: a `loading.tsx` per route created a Suspense boundary, and the
// boundary is what let a click transition immediately instead of freezing on the old page
// (specs/feature-navigation-loading-feedback.md). Those files are gone, because the same
// boundary makes React stream the page into a `<div hidden>` at the end of the document and
// move it into place with a script — so with JavaScript disabled the product list was in the
// response but never rendered. See specs/bugfix-ssr-product-list-behind-suspense.md.
//
// Without a boundary the server sends complete HTML, and the feedback has to come from the
// client instead: `useLinkStatus()` reports the pending state of the navigation its parent
// <Link> started, and this context lifts that out of the link so the page area can react to
// it. What the reporter cannot see, Suspense could: **browser back/forward gives no
// feedback**, and neither does a `router.push` that does not go through `useNavigate` below.
// Back/forward is normally served from the router cache, so it is instant anyway.

// A pending navigation must last this long before anything is drawn — a placeholder shown for
// two frames reads as a glitch, not as feedback. Measured in a real browser against this
// stack (dev, warm): a category → category click takes 180–630 ms depending on how busy the
// main thread is, a header search ~1.2 s. So navigations do cluster either side of this
// threshold, and the value is a judgement, not a fit: under ~150 ms nobody perceives a wait,
// and above it the wait tends to be several hundred ms more.
//
// Careful when re-measuring: a rAF sampler stops recording while React parses the RSC
// payload, which makes a skeleton that was up for 300 ms look like a 40 ms flash.
const SHOW_AFTER_MS = 150;

// A navigation ends when the ROUTE changes, not when the link that started it says so — see
// the long comment in LinkPendingReporter. `from` is the pathname the navigation started on,
// which is what makes "has it committed yet?" answerable here.
interface Pending {
  href: string;
  from: string;
}

interface NavigationState {
  // The locale-prefixed href being navigated TO, once the navigation has been pending long
  // enough to be worth showing and while it has not committed. Null when idle.
  pendingHref: string | null;
  report: (href: string, pending: boolean) => void;
}

const NavigationContext = createContext<NavigationState>({
  pendingHref: null,
  report: () => {},
});

// Nothing may hold the page hostage: if a navigation neither commits nor reports back — an
// aborted transition whose link has already unmounted — the placeholder has to give the real
// page back rather than sit there for ever.
const GIVE_UP_MS = 10_000;

export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const [pending, setPending] = useState<Pending | null>(null);
  const [elapsed, setElapsed] = useState(false);

  const report = useCallback((href: string, isPending: boolean) => {
    setPending(prev => {
      // Same navigation reported again (a re-render of the link): keep the object identity,
      // or the timers below restart on every report and the placeholder never appears.
      if (isPending) return prev?.href === href ? prev : { href, from: pathnameRef.current };
      // Href-guarded: two reporters can be mounted at once (a header link and a page link),
      // and a settling one must not wipe a navigation that started after it.
      return prev?.href === href ? null : prev;
    });
  }, []);

  // The navigation committed: the router is now on a different path than the one the click
  // started from. Derived during render, not in an effect, so the placeholder and the new page
  // never both get a frame — an effect here would show the skeleton for one paint on top of
  // content that was ready.
  const committed = pending !== null && pathname !== pending.from;

  useEffect(() => {
    if (committed) setPending(null);
  }, [committed]);

  useEffect(() => {
    if (!pending) {
      setElapsed(false);
      return undefined;
    }
    // Prefetched or cached navigations commit within a few frames, and a placeholder drawn
    // for those reads as a flicker. Nothing is shown until the wait is real.
    const show = setTimeout(() => setElapsed(true), SHOW_AFTER_MS);
    const giveUp = setTimeout(() => setPending(null), GIVE_UP_MS);
    return () => { clearTimeout(show); clearTimeout(giveUp); };
  }, [pending]);

  const pendingHref = pending && elapsed && !committed ? pending.href : null;
  const value = useMemo(() => ({ pendingHref, report }), [pendingHref, report]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

// The href of the navigation currently in flight, or null. Consumed by AppShell.
export function useNavigationPending(): string | null {
  return useContext(NavigationContext).pendingHref;
}

// Must render INSIDE a <Link>: useLinkStatus() reads a context that Link provides, so
// anywhere else it reports nothing, for ever, silently. LocaleLink puts one in every link it
// renders; it draws no DOM of its own.
export function LinkPendingReporter({ href }: { href: string }): null {
  const { pending } = useLinkStatus();
  const { report } = useContext(NavigationContext);
  const wasPending = useRef(false);

  useEffect(() => {
    // Deliberately NO unmount cleanup, and this is the whole subtlety of the file. Most links
    // live inside the page area that the pending placeholder REPLACES, so the clicked link
    // unmounts the instant the placeholder appears. Clearing from a cleanup therefore
    // cancelled the navigation state one frame after showing it, and AppShell put the
    // OUTGOING page back on screen until the real navigation committed — reported as "the
    // content flashes to the same content, with a loading placeholder in between".
    //
    // So a link only ever reports the two things it actually knows: a navigation started, and
    // a navigation it started has settled *while it was still mounted* (an aborted click,
    // typically to the URL already open). Deciding that a navigation finished belongs to the
    // provider, which watches the route instead of a component's lifetime.
    if (pending) report(href, true);
    else if (wasPending.current) report(href, false);
    wasPending.current = pending;
  }, [pending, href, report]);

  return null;
}

// For imperative navigation, which no <Link> can report on. The transition is what makes the
// pending state exist at all: `router.push` returns immediately, and it is React that then
// holds the old UI on screen until the new route's payload arrives. Outside a transition
// that wait is simply invisible.
export function useNavigate(): (href: string) => void {
  const router = useRouter();
  const { report } = useContext(NavigationContext);
  const [isPending, startTransition] = useTransition();
  const hrefRef = useRef<string | null>(null);

  useEffect(() => {
    const href = hrefRef.current;
    if (!href) return;
    report(href, isPending);
    if (!isPending) hrefRef.current = null;
  }, [isPending, report]);

  return useCallback((href: string) => {
    hrefRef.current = href;
    startTransition(() => router.push(href));
  }, [router]);
}
