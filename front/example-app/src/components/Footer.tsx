import { useTranslation } from 'react-i18next';
import BrandLockup from './BrandLockup';
import SectionLinks from './SectionLinks';

export default function Footer() {
  const { t } = useTranslation('common');
  return (
    // One row (specs/feature-footer-single-row.md): the header's lockup on the left, the
    // powered-by line in the centre, the header's section links on the right.
    <footer className="footer">
      <BrandLockup />
      <p>
        {/* Gally's own product page on the vendor site. Not gally.io — that domain belongs
            to an unrelated product. */}
        {t('footer.poweredBy')} <a href="https://elasticsuite.io/products/gally/" target="_blank" rel="noreferrer">Gally</a>
      </p>
      <SectionLinks className="footer-nav" />
    </footer>
  );
}
