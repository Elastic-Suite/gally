import type { Metadata, Viewport } from 'next';
import { SITE, SITE_NAME } from '../src/sdk/seo';
import '../src/styles.css';

export const metadata: Metadata = {
  // `template` suffixes every page that sets its own title, so a product tab reads
  // "Claudia Crochet Dress · Gally" instead of a bare product name with no context.
  // `default` is the fallback for any route that sets none — after this change that
  // should only ever be an error page.
  title: {
    default: 'Gally Features — ElasticSuite Demo',
    template: `%s · ${SITE_NAME}`,
  },
  // Lets Next resolve relative URLs in openGraph/alternates instead of emitting them
  // relative, which crawlers cannot follow.
  metadataBase: new URL(SITE),
  openGraph: { siteName: SITE_NAME },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Geist 400/500/600/700 — the four weights elasticsuite.io ships, and exactly the
            four this stylesheet uses. Their site self-hosts woff2; Google Fonts serves the
            same family, so the app keeps a single <link> instead of vendored font files. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {/* The provider tree lives in app/[locale]/layout.tsx, not here — it needs the
            server-resolved catalog, which only exists once the locale segment is known. */}
        {children}
      </body>
    </html>
  );
}
