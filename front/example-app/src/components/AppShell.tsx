'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { EventLogProvider } from '../contexts/EventLogContext';
import { useDemo } from '../contexts/DemoContext';
import { useNavigationPending } from '../contexts/NavigationContext';
import { useMounted } from '../hooks/useMounted';
import Header from './Header';
import Footer from './Footer';
import RouteSkeleton from './RouteSkeleton';
import ScrollToTop from './ScrollToTop';

// The demo scaffolding is kept out of the server payload deliberately: it has zero SEO
// value and is pure client behaviour, so a crawler reads a page containing only the
// storefront while users still get all of it, identically.
//
// That intent used to be spelled `{ ssr: false }`, which implements it by throwing
// `BailoutToCSR` during the server render — legal, caught by next/dynamic's own
// Suspense boundary, but it made Next serialize a full stack trace into every dev
// response (4 templates, ~47KB of an 80KB document) and show four red errors in the
// overlay. The `mounted` gate below expresses the same intent without the throw: these
// components are simply never rendered on the server. `dynamic()` stays, for the code
// split. See specs/bugfix-dynamic-ssr-false-bailout.md.
const EventLog = dynamic(() => import('./EventLog'));
const IntroScreen = dynamic(() => import('./IntroScreen'));
const StoryCompanion = dynamic(() => import('./StoryCompanion'));
const TrackingInsights = dynamic(() => import('./TrackingInsights'));
const SearchExplain = dynamic(() => import('./SearchExplain'));

// The former src/App.tsx, minus its <Routes> block — App Router file routes now
// supply that as `children`. Everything else is carried across unchanged.
function AppShell({ children }: { children: React.ReactNode }) {
  const { introSeen, audience } = useDemo();
  const mounted = useMounted();

  // A click on a server-fetched route waits for that server response, and with no Suspense
  // boundary in the app there is nothing to show feedback in its place — so this does it
  // here, where the pending navigation is known. Null unless a navigation is in flight for
  // long enough to be worth showing, and null for routes with nothing to wait on, in which
  // case the current page simply stays until it is replaced.
  const pendingHref = useNavigationPending();
  const pendingSkeleton = pendingHref ? <RouteSkeleton href={pendingHref} /> : null;

  // `mounted &&` also guards this branch: the intro replaces the entire layout, so
  // without it the server would render an empty document for every route the moment
  // the intro is re-enabled. (It is currently unreachable — DemoContext initialises
  // `introSeen` to true and nothing sets it back — but the guard has to be right
  // before that changes, not after.)
  if (mounted && !introSeen) {
    return <IntroScreen />;
  }

  return (
    <EventLogProvider>
      <ScrollToTop />
      <div className={`app-layout mode-${audience}`}>
        <Header />
        {/* Replaces the page rather than covering it, which is what the Suspense fallback
            did too: the outgoing page's data is already stale, and keeping it mounted under
            an overlay would leave its effects — tracking included — running against a route
            the user has left. */}
        <main className="main-content" data-navigating={pendingSkeleton ? '' : undefined}>
          {pendingSkeleton ?? children}
        </main>
        <Footer />
        {mounted && (
          <>
            <div className="expert-only">
              <EventLog />
            </div>
            <TrackingInsights />
            <SearchExplain />
            <StoryCompanion />
          </>
        )}
      </div>
    </EventLogProvider>
  );
}

export default AppShell;
