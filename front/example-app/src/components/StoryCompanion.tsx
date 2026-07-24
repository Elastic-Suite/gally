import { useDemo } from '../contexts/DemoContext';
import { useStoryActions } from '../hooks/useStoryActions';

export default function StoryCompanion() {
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
        📖 Reprendre le récit
      </button>
    );
  }

  if (!currentStory) return null;

  const isFirst = storyStep === 0;
  const isLast = storyStep === steps.length - 1;
  const persona = currentStory.persona === 'camille' ? scenario.personas.customer : scenario.personas.merchant;

  return (
    <div className="story-dock">
      <div className="story-dock-header">
        <div className="story-progress">
          {steps.map((_, i) => (
            <button
              key={i}
              className={`story-segment ${i === storyStep ? 'active' : ''} ${i < storyStep ? 'done' : ''}`}
              onClick={() => jumpStep(i)}
              title={`Acte ${i + 1}`}
            />
          ))}
        </div>
        <button className="story-close" onClick={skipStory} title="Fermer">✕</button>
      </div>

      <div className="story-act-label">
        Acte {currentStory.act} — {currentStory.title}
      </div>

      <div className="story-persona">
        <span className="story-persona-avatar">{persona.emoji}</span>
        <span className="story-persona-name">{persona.name}</span>
      </div>

      <div
        className="story-bubble"
        dangerouslySetInnerHTML={{ __html: currentStory.bubble }}
      />

      <div className="story-gain">{currentStory.gain}</div>

      <div className="story-nav">
        <button
          className="btn btn-outline btn-sm"
          onClick={prevStep}
          disabled={isFirst}
        >
          ‹ Précédent
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={nextStep}
          disabled={isLast}
        >
          Suivant ›
        </button>
      </div>
    </div>
  );
}
