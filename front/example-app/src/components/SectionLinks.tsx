'use client';

import Link from './LocaleLink';
import { useTranslation } from 'react-i18next';
import { useAppPathname } from '../contexts/LocaleContext';
import { useCatalog } from '../contexts/CatalogContext';
import { defaultListingPath } from '../sdk/categoryTree';

// The section links, shared by the header (`header-nav`) and the footer (`footer-nav`), so
// both always agree on what is current (specs/feature-footer-light.md).
//
// No Home item — the brand lockup is the link to `/`. Plain text links, the active one
// underlined: the segmented Products/Articles switch was built for the dark bar and went with
// it (specs/feature-header-light-two-row.md). Every link is a direct child of the <nav>, so
// `.header-nav > a` / `.footer-nav > a` style all four.
export default function SectionLinks({ className }: { className: string }) {
  const { t } = useTranslation('common');
  const { categories } = useCatalog();
  // Locale-free: usePathname() would return `/com_en/blog`, against which every route test
  // below is false. That is what had silently killed the nav's active state.
  const pathname = useAppPathname();
  const isActive = (path: string) => pathname === path ? 'active' : '';

  // Which section link is active. 'none' is a real state: the homepage, the cart and /explain
  // are inside neither section, and neither link may then claim to be current.
  const navSection = pathname.startsWith('/category')
    ? 'products'
    : pathname.startsWith('/blog')
      ? 'blog'
      : 'none';

  return (
    <nav className={className}>
      <Link
        href={defaultListingPath(categories)}
        className={navSection === 'products' ? 'active' : ''}
        aria-current={navSection === 'products' ? 'page' : undefined}
      >
        {t('nav.products')}
      </Link>
      <Link
        href="/blog"
        className={navSection === 'blog' ? 'active' : ''}
        aria-current={navSection === 'blog' ? 'page' : undefined}
      >
        {t('nav.cms')}
      </Link>
      <Link href="/explain" className={`expert-only ${isActive('/explain')}`}>{t('nav.searchIntelligence')}</Link>
      {/* Deliberately NOT `expert-only`, unlike /explain beside it: that class is
          display:none under the default `direction` audience mode (see .mode-direction
          .expert-only), which is why this link was invisible when it first shipped. The
          comparison is the thing this demo is for, so it is always reachable. */}
      <Link
        href="/vector-search"
        className={isActive('/vector-search')}
        aria-current={pathname === '/vector-search' ? 'page' : undefined}
      >
        {t('nav.vectorSearch')}
      </Link>
    </nav>
  );
}
