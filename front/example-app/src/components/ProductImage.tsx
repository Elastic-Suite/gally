'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

// Every product picture goes through here, so a missing file shows the same placeholder
// everywhere instead of the browser's broken-image icon. A few demo products point at images
// that were never published (specs/feature-product-image-placeholder.md).
export default function ProductImage({ src, alt, style, loading }: {
  src?: string | null;
  alt: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Server-rendered markup can fail to load before React attaches onError, so check the
  // image once on mount too. `complete` with no width means the browser gave up on it.
  useEffect(() => {
    setFailed(false);
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed) {
    return (
      <span className="product-image-placeholder" role="img" aria-label={alt}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </span>
    );
  }

  return <img ref={ref} src={src} alt={alt} style={style} loading={loading} onError={() => setFailed(true)} />;
}
