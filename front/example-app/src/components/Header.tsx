'use client'

import { useLayoutEffect, useRef } from 'react'
import Link from './LocaleLink'
import { useTranslation } from 'react-i18next'
import { useAppPathname } from '../contexts/LocaleContext'
import { useCatalog } from '../contexts/CatalogContext'
import { useCart } from '../contexts/CartContext'
import SearchBar from './SearchBar'
import CategoryNav from './CategoryNav'
import BrandLockup from './BrandLockup'
import SectionLinks from './SectionLinks'
import Icon from './Icon'

export default function Header() {
  const { t } = useTranslation('common')
  const {
    selectedCatalog,
    selectedLocalizedCatalog,
    setCatalog,
    setLocalizedCatalog,
    catalogs,
    categories,
    loadingCatalogs,
  } = useCatalog()
  const { itemCount } = useCart()
  // Locale-free: usePathname() would return `/com_en/blog`. The section links' active state
  // lives in SectionLinks now; this one only picks the route without a search band.
  const pathname = useAppPathname()
  const groupRef = useRef<HTMLDivElement | null>(null)
  const slotRef = useRef<HTMLDivElement | null>(null)

  const localizedCatalogs = selectedCatalog?.localizedCatalogs || []

  // /vector-search is the one route that supplies its own search input. See the slot below.
  const hideSearchBar = pathname === '/vector-search'

  // Expose the real rendered height of the whole group as --header-height, so CSS can offset
  // against it instead of guessing: it is the search overlay's top padding. Measured, because
  // it changes with viewport width: both header rows wrap on mobile.
  // The same observer publishes the search slot's box relative to the group. On focus the bar
  // leaves the slot for a place below the header, and back; CSS can only animate that between
  // two known boxes, and the slot's depends on the links and selects of each catalog and
  // language. data-search-slot tells the CSS the variables exist. See
  // specs/feature-header-search-drop.md.
  useLayoutEffect(() => {
    const group = groupRef.current
    if (!group) return
    const update = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${group.offsetHeight}px`
      )
      const slot = slotRef.current
      if (!slot) return
      const g = group.getBoundingClientRect()
      const r = slot.getBoundingClientRect()
      // Only opening and closing animate. A new measurement must jump: the first one switches
      // the bar from the slot's flow to absolute, where its `width: 100%` would resolve against
      // the whole group and shrink from there on page load; later ones (resize) would make the
      // bar trail the slot. data-search-measuring turns the transition off, and the forced
      // layout applies the new box before it is turned back on.
      group.dataset.searchMeasuring = ''
      group.style.setProperty('--search-slot-x', `${r.left - g.left}px`)
      group.style.setProperty('--search-slot-y', `${r.top - g.top}px`)
      group.style.setProperty('--search-slot-w', `${r.width}px`)
      group.style.setProperty('--search-slot-h', `${r.height}px`)
      group.dataset.searchSlot = ''
      void group.offsetWidth
      delete group.dataset.searchMeasuring
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(group)
    if (slotRef.current) observer.observe(slotRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="header-sticky-group" ref={groupRef}>
      <header className="header">
        <div className="header-inner">
          <BrandLockup />
          <SectionLinks className="header-nav" />

          {/* The search fills the gap between the links and the selects. On /vector-search ONLY
              the slot stays empty: that page carries its own full-width search box which IS the
              page, so the header's bar was a second search input above it doing something
              different (it navigates to /search and abandons the comparison). Not rendered
              rather than CSS-hidden, so the SearchBar and its overlay are not mounted at all.
              The empty slot keeps the row from shifting. `SearchBarProvider` lives in
              app/providers.tsx, so `useSearchBarRef()` still resolves with a null `ref.current`;
              its one consumer outside SearchBar, useStoryActions' `type_and_search`, already
              guards with `if (!handle) return`. */}
          <div className="header-search-slot" ref={slotRef}>
            {!hideSearchBar && (
              <SearchBar
                categories={categories}
                categoriesLoading={loadingCatalogs}
              />
            )}
          </div>

          <div className="context-selectors">
            <select
              className="context-select"
              value={selectedCatalog?.code || ''}
              onChange={(e) => setCatalog(e.target.value)}
            >
              {catalogs.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="context-select"
              value={selectedLocalizedCatalog?.code || ''}
              onChange={(e) => setLocalizedCatalog(e.target.value)}
            >
              {localizedCatalogs.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Icon only on screen; the label stays in the accessible name as visually hidden
              text rather than aria-label, so the count after it is announced too. */}
          <Link href="/cart" className="cart-badge">
            <Icon name="cart" standalone className="cart-icon" />
            <span className="visually-hidden">{t('cart.link')}</span>
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>

        {/* The category row is part of the header since specs/feature-header-light-two-row.md:
            here in the app shell it is outside <main>, so no navigation ever swaps it out. It is
            inside <header> on purpose, so the two rows share one surface. */}
        <CategoryNav />
      </header>
    </div>
  )
}
