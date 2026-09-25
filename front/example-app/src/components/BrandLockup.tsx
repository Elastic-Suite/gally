'use client';

import Link from './LocaleLink';
import { useTranslation } from 'react-i18next';
import brandMark from '../assets/gally-rabbit.svg';

// The logo link, shared by the header and the footer (specs/feature-footer-light.md). The
// class names stay `header-logo*` because the header is where the lockup is specified
// (specs/feature-logo-gally-example.md); the footer reuses it as is.
export default function BrandLockup() {
  const { t } = useTranslation('common');
  return (
    // Mark + wordmark: the asset is the rabbit alone, so the "Gally example" type is set
    // here. The words are a brand name, not copy — never translated. Both spans are
    // aria-hidden with the accessible name on the link, so the lockup is announced once
    // rather than as mark + two words.
    <Link href="/" className="header-logo" aria-label={t('brand.ariaLabel')}>
      {/* CRA resolved an SVG import to a URL string; Next resolves it to a
          StaticImageData object, so the URL now lives on .src */}
      <img src={brandMark.src} alt="" className="header-logo-mark" />
      <span className="header-logo-text" aria-hidden="true">
        <span className="header-logo-name">Gally</span>
        <span className="header-logo-accent">example</span>
      </span>
    </Link>
  );
}
