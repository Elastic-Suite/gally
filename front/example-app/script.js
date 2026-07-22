// Renders the static product list into #app. No API call yet - see products.js for the data.

const BAG_ICON = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 7h12l1 13H5L6 7Z" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
  </svg>
`

function formatPrice(price) {
  return `${price.toFixed(2)} €`
}

function renderProductCard(product) {
  const tag = product.tag ? `<span class="product-card__tag">${product.tag}</span>` : ''

  return `
    <article class="product-card">
      ${tag}
      <div class="product-card__media product-card__media--${product.tint}">${BAG_ICON}</div>
      <h3 class="product-card__name">${product.name}</h3>
      <p class="product-card__price">${formatPrice(product.price)}</p>
      <button class="btn btn-primary" type="button">Add to cart</button>
    </article>
  `
}

function renderApp() {
  const app = document.getElementById('app')

  app.innerHTML = `
    <header class="page-header">
      <span class="page-header__logo">Gally<span>.</span></span>
    </header>
    <section class="hero">
      <div class="showcase-panel">
        <h1 class="showcase-panel__title">Best sellers</h1>
        <p class="showcase-panel__subtitle">Inspired by your visits</p>
        <div class="product-grid">
          ${PRODUCTS.map(renderProductCard).join('')}
        </div>
      </div>
    </section>
  `
}

renderApp()
