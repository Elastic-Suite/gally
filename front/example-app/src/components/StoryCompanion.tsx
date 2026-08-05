import { useTranslation } from 'react-i18next';
import { useDemo } from '../contexts/DemoContext';
import { useStoryActions } from '../hooks/useStoryActions';

export default function StoryCompanion() {
  const { t } = useTranslation(['demo', 'scenarios']);
  const {
    scenario, storyActive, storyStep, storyMinimized, currentStory,
    nextStep, prevStep, jumpStep, resumeStory, skipStory,
  } = useDemo();

  const steps = scenario.steps;

  // Delegate all action execution to the generic engine
  useStoryActions({
    step: currentStory,
    active: storyActive,
    minimized: storyMinimized,
  });

  if (!storyActive) return null;

  // Minimized pill
  if (storyMinimized) {
    return (
      <button className="story-resume-pill" onClick={resumeStory}>
        {t('story.resumePill')}
      </button>
    );
  }

  if (!currentStory) return null;

  const isFirst = storyStep === 0;
  const isLast = storyStep === steps.length - 1;
  const persona = currentStory.persona === 'camille' ? scenario.personas.customer : scenario.personas.merchant;
  const stepBase = `scenarios:${scenario.i18nKey}.${currentStory.i18nKey}`;
  const personaName = currentStory.persona === 'camille'
    ? scenario.personas.customer.name
    : t(`scenarios:${scenario.i18nKey}.personas.merchant.name`);

  return (
    <div className="story-dock">
      <div className="story-dock-header">
        <div className="story-progress">
          {steps.map((_, i) => (
            <button
              key={i}
              className={`story-segment ${i === storyStep ? 'active' : ''} ${i < storyStep ? 'done' : ''}`}
              onClick={() => jumpStep(i)}
              title={t('story.actLabel', { num: i + 1 })}
            />
          ))}
        </div>
        <button className="story-close" onClick={skipStory} title={t('story.close')}>✕</button>
      </div>

      <div className="story-act-label">
        {t('story.actTitle', { act: currentStory.act, title: t(`${stepBase}.title`) })}
      </div>

      <div className="story-persona">
        <span className="story-persona-avatar">{persona.emoji}</span>
        <span className="story-persona-name">{personaName}</span>
      </div>

      <div
        className="story-bubble"
        dangerouslySetInnerHTML={{ __html: t(`${stepBase}.bubble`) }}
      />

      <div className="story-gain">{t(`${stepBase}.gain`)}</div>

      <div className="story-nav">
        <button
          className="btn btn-outline btn-sm"
          onClick={prevStep}
          disabled={isFirst}
        >
          {t('story.prev')}
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={nextStep}
          disabled={isLast}
        >
          {t('story.next')}
        </button>
      </div>
    </div>
  );
}
