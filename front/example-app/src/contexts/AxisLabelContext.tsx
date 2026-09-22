'use client';

import { createContext, useContext, ReactNode } from 'react';
import { AxisLabels, axisLabel } from '../sdk/axisLabels';

// Configurable-axis headings for the current localized catalogue, fetched ONCE on the server in
// app/[locale]/layout.tsx and handed down — the same shape as LocaleContext and for the same
// reason. Two things follow from fetching there rather than in the PDP:
//
//  - the heading is in the server-rendered HTML, so it does not pop in on hydration. That was the
//    objection in specs/feature-configurable-option-selection.md to using the aggregation's
//    localized label, and it is why this is not a useEffect.
//  - the quick-add overlay on a listing row reads the same labels as the PDP, without a second
//    request. One fetch per catalogue per page load, not one per product.
const AxisLabelContext = createContext<AxisLabels | null>(null);

export function AxisLabelProvider({
  labels,
  children,
}: {
  labels: AxisLabels;
  children: ReactNode;
}) {
  return <AxisLabelContext.Provider value={labels}>{children}</AxisLabelContext.Provider>;
}

// Returns a code → heading function. Falls back to the humanised code when the provider is
// absent, so a component rendered outside the tree degrades to a readable heading instead of
// throwing — unlike useLocale(), because a missing heading must never take a page down.
export function useAxisLabel(): (code: string) => string {
  const labels = useContext(AxisLabelContext);
  return (code: string) => axisLabel(labels || {}, code);
}
