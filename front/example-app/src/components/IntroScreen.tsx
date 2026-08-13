import { useTranslation } from 'react-i18next';
import { useDemo } from '../contexts/DemoContext';

export default function IntroScreen() {
  const { t } = useTranslation(['demo', 'scenarios']);
  const { scenario, setIntroSeen, audience, setAudience, startStory } = useDemo();
  const { customer, merchant } = scenario.personas;

  const handleStart = (withStory: boolean) => {
    setIntroSeen(true);
    if (withStory) startStory();
  };

  return (
    <div className="intro-overlay">
      <div className="intro-card">
        {/* Same wordmark as the header lockup, same white/coral split — here on a light
            card, so the first word takes --indigo-900 from .intro-logo instead of white. */}
        <div className="intro-logo">Gally <span>example</span></div>
        <h1>{t('intro.welcome')}</h1>
        <p className="intro-subtitle">{t(`scenarios:${scenario.i18nKey}.description`)}</p>

        <div className="intro-personas">
          <div className="persona-card">
            <div className="persona-avatar">{customer.emoji}</div>
            <div className="persona-name">{customer.name}</div>
            <div className="persona-role">{t(`scenarios:${scenario.i18nKey}.personas.customer.role`)}</div>
          </div>
          <div className="persona-card">
            <div className="persona-avatar">{merchant.emoji}</div>
            <div className="persona-name">{t(`scenarios:${scenario.i18nKey}.personas.merchant.name`)}</div>
            <div className="persona-role">{t(`scenarios:${scenario.i18nKey}.personas.merchant.role`)}</div>
          </div>
        </div>

        <div className="intro-audience">
          <label className="intro-audience-label">{t('intro.presentationMode')}</label>
          <div className="audience-toggle">
            <button
              className={`audience-btn ${audience === 'direction' ? 'active' : ''}`}
              onClick={() => setAudience('direction')}
            >
              {t('intro.direction')}
            </button>
            <button
              className={`audience-btn ${audience === 'marketing' ? 'active' : ''}`}
              onClick={() => setAudience('marketing')}
            >
              {t('intro.marketing')}
            </button>
          </div>
          <p className="audience-hint">
            {audience === 'direction'
              ? t('intro.hintDirection')
              : t('intro.hintMarketing')}
          </p>
        </div>

        <div className="intro-actions">
          <button className="btn btn-coral btn-lg" onClick={() => handleStart(true)}>
            {t('intro.startGuided')}
          </button>
          <button className="btn btn-outline" onClick={() => handleStart(false)}>
            {t('intro.exploreFreely')}
          </button>
        </div>
      </div>
    </div>
  );
}
