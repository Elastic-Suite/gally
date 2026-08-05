import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation('common');
  return (
    <footer className="footer">
      <p>
        {t('footer.poweredBy')} <a href="https://elasticsuite.io" target="_blank" rel="noreferrer">ElasticSuite</a> &mdash; {t('footer.tagline')}
      </p>
    </footer>
  );
}
