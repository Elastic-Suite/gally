import { Link } from 'react-router'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-brand-500 bg-brand-900 text-paper-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-bold text-paper-50">Gally Shop</p>
          <p className="mt-2 max-w-sm text-sm text-paper-50/60">
            A demo storefront mockup built on the Gally product catalog,
            showcasing search, browsing and merchandising possibilities.
          </p>
        </div>
        <nav className="flex gap-8 text-sm">
          <div>
            <p className="mb-2 font-semibold">Shop</p>
            <ul className="flex flex-col gap-1.5 text-paper-50/70">
              <li>
                <Link to="/" className="hover:text-paper-50">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-paper-50">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-paper-50">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  )
}
