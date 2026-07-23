import { Link } from 'react-router'
import { TopBar } from './TopBar'
import { MegaMenu } from './MegaMenu'
import { BlogsMenu } from './BlogsMenu'
import { SearchAutocomplete } from './SearchAutocomplete'
import { MiniCart } from './MiniCart'
import logo from '../../assets/images/gally-logo.svg'

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-brand-900">
      <TopBar />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 border-b border-white/10 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <img src={logo} alt="" className="h-8 w-auto" />
          <span className="flex flex-col leading-tight">
            <span className="text-paper-50">Gally</span>
            <span className="text-accent-500">Shop</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <MegaMenu />
          <BlogsMenu />
        </nav>
        <div className="order-last w-full sm:order-none sm:ml-4 sm:flex-1">
          <SearchAutocomplete />
        </div>
        <MiniCart />
      </div>
    </header>
  )
}
