import ProductCard from './ProductCard';

interface Props {
  products: any[];
  title?: string;
}

export default function ProductSlider({ products, title }: Props) {
  return (
    <section className="product-slider">
      {title && <h2>{title}</h2>}
      <div className="slider-track">
        {products.map((p, i) => (
          <ProductCard key={p.sku || i} product={p} />
        ))}
      </div>
    </section>
  );
}
