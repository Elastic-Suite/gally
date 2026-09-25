import { useTranslation } from 'react-i18next';
import BrandLockup from './BrandLockup';
import SectionLinks from './SectionLinks';

export default function Footer() {
  const { t } = useTranslation('common');
  return (
    // Mirrors the header (specs/feature-footer-light.md): the same lockup and section links
    // as a first row, the powered-by line under a full-width rule.
    <footer className="footer">
      <BrandLockup />
      <SectionLinks className="footer-nav" />
      <p>
        {/* Gally's own product page on the vendor site. Not gally.io — that domain belongs
            to an unrelated product. */}
        {t('footer.poweredBy')} <a href="https://elasticsuite.io/products/gally/" target="_blank" rel="noreferrer">Gally</a> &mdash; {t('footer.tagline')}
      </p>
    </footer>
  );
}
