'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Icon from './Icon'

// Every product picture goes through here, so a missing file shows the same placeholder
// everywhere instead of the browser's broken-image icon. A few demo products point at images
// that were never published (specs/feature-product-image-placeholder.md).
export default function ProductImage({
  src,
  alt,
  style,
  loading,
}: {
  src?: string | null
  alt: string
  style?: CSSProperties
  loading?: 'lazy' | 'eager'
}) {
  const [failed, setFailed] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  // A new picture gets a fresh chance. Reset during render, comparing with the previous src,
  // so the placeholder of the old image is never shown for the new one.
  const [prevSrc, setPrevSrc] = useState(src)
  if (src !== prevSrc) {
    setPrevSrc(src)
    setFailed(false)
  }

  // Server-rendered markup can fail to load before React attaches onError, so check the
  // image once on mount too, and again for each new src. `complete` with no width means the
  // browser gave up on it. This reads the DOM after commit, so it has to stay an effect.
  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [src])

  if (!src || failed) {
    return (
      <span className="product-image-placeholder" role="img" aria-label={alt}>
        <Icon name="image" standalone />
      </span>
    )
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      style={style}
      loading={loading}
      onError={() => setFailed(true)}
    />
  )
}
