import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation('common');
  return (
    <footer className="footer">
      <p>
        {/* Gally's own product page on the vendor site. Not gally.io — that domain belongs
            to an unrelated product. */}
        {t('footer.poweredBy')} <a href="https://elasticsuite.io/products/gally/" target="_blank" rel="noreferrer">Gally</a> &mdash; {t('footer.tagline')}
      </p>
    </footer>
  );
}
