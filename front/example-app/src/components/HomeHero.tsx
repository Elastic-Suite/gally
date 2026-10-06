import Link from './LocaleLink'
import { useMediaUrl } from '../contexts/ConfigContext'

interface Props {
  title: string
  body: string
  images: string[]
  ctaHref: string | null
  ctaLabel: string
}

// The wide homepage hero of a sample shop: copy and button bottom-left, three product photos on
// the right. The photos are decoration - the button carries the action - so their alt is empty.
export default function HomeHero({
  title,
  body,
  images,
  ctaHref,
  ctaLabel,
}: Props) {
  const media = useMediaUrl()
  return (
    <section className="home-hero">
      <div className="home-hero-media">
        {images.map((src) => (
          <img key={src} src={media(src)} alt="" />
        ))}
      </div>
      <div className="home-hero-copy">
        <h1>{title}</h1>
        <p>{body}</p>
        {ctaHref && (
          <Link href={ctaHref} className="btn btn-dark btn-lg">
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
