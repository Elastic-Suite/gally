import Link from './LocaleLink';
import ProductCard from './ProductCard';

// The homepage's panel layout: a title column beside the row instead of a heading above it, so
// those rows do not look like the cart and product page ones. See specs/feature-homepage-blocks.md.
interface Panel {
  eyebrow: string;
  seeAllHref: string | null;
  seeAllLabel: string;
  side?: 'start' | 'end'; // which side the title column sits on
}

interface Props {
  products: any[];
  title?: string;
  panel?: Panel;
}

export default function ProductSlider({ products, title, panel }: Props) {
  const track = (
    <div className="slider-track">
      {products.map((p, i) => (
        <ProductCard key={p.sku || i} product={p} />
      ))}
    </div>
  );

  if (!panel) {
    return (
      <section className="product-slider">
        {title && <h2>{title}</h2>}
        {track}
      </section>
    );
  }

  return (
    <section className={`product-slider product-slider--panel${panel.side === 'end' ? ' product-slider--end' : ''}`}>
      <div className="product-slider-aside">
        <span className="product-slider-eyebrow">{panel.eyebrow}</span>
        {title && <h2>{title}</h2>}
        {panel.seeAllHref && (
          <Link href={panel.seeAllHref} className="btn btn-dark">
            {panel.seeAllLabel}
          </Link>
        )}
      </div>
      {track}
    </section>
  );
}
