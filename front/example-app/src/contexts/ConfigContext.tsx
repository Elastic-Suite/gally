'use client';

import { createContext, useContext, ReactNode } from 'react';
import { GallyConfig, mediaUrl } from '../sdk/config';

// Gally's public configuration for the current localized catalog, fetched ONCE on the server in
// app/[locale]/layout.tsx and handed down - the same shape as AxisLabelContext. A catalog switch
// is a navigation to a new [locale] segment, which re-runs that layout, so the scoped values
// always match the catalog on screen.
const ConfigContext = createContext<GallyConfig>({});

export function ConfigProvider({
  config,
  children,
}: {
  config: GallyConfig;
  children: ReactNode;
}) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

// An empty map outside the provider, so mediaUrl() falls back to the local default instead of
// throwing.
export function useGallyConfig(): GallyConfig {
  return useContext(ConfigContext);
}

// Returns a path -> absolute image URL function for this instance.
export function useMediaUrl(): (path: string | string[] | undefined | null) => string {
  const config = useGallyConfig();
  return (path) => mediaUrl(config, path);
}
