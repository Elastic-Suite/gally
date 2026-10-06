import Link from './LocaleLink'
import { useMediaUrl } from '../contexts/ConfigContext'

interface Card {
  key: string
  title: string
  body: string
  image: string
  href: string
}

interface Props {
  cards: Card[]
  ctaLabel: string
}

// Two promo cards between the homepage sliders: product photo left, dark panel right with a
// button to the category.
export default function HomePromoCards({ cards, ctaLabel }: Props) {
  const media = useMediaUrl()
  return (
    <section className="home-cards">
      {cards.map((card) => (
        <article key={card.key} className="home-card">
          <div className="home-card-media">
            <img src={media(card.image)} alt="" />
          </div>
          <div className="home-card-panel">
            <h2>{card.title}</h2>
            <p>{card.body}</p>
            <Link href={card.href} className="btn btn-light">
              {ctaLabel}
            </Link>
          </div>
        </article>
      ))}
    </section>
  )
}
