import { useDemo } from '../contexts/DemoContext';

export default function IntroScreen() {
  const { scenario, setIntroSeen, audience, setAudience, startStory } = useDemo();
  const { customer, merchant } = scenario.personas;

  const handleStart = (withStory: boolean) => {
    setIntroSeen(true);
    if (withStory) startStory();
  };

  return (
    <div className="intro-overlay">
      <div className="intro-card">
        <div className="intro-logo">Elastic<span>Suite</span></div>
        <h1>Bienvenue dans la démo Gally</h1>
        <p className="intro-subtitle">{scenario.description}</p>

        <div className="intro-personas">
          <div className="persona-card">
            <div className="persona-avatar">{customer.emoji}</div>
            <div className="persona-name">{customer.name}</div>
            <div className="persona-role">{customer.role}</div>
          </div>
          <div className="persona-card">
            <div className="persona-avatar">{merchant.emoji}</div>
            <div className="persona-name">{merchant.name}</div>
            <div className="persona-role">{merchant.role}</div>
          </div>
        </div>

        <div className="intro-audience">
          <label className="intro-audience-label">Mode de présentation :</label>
          <div className="audience-toggle">
            <button
              className={`audience-btn ${audience === 'direction' ? 'active' : ''}`}
              onClick={() => setAudience('direction')}
            >
              Direction
            </button>
            <button
              className={`audience-btn ${audience === 'marketing' ? 'active' : ''}`}
              onClick={() => setAudience('marketing')}
            >
              Marketing
            </button>
          </div>
          <p className="audience-hint">
            {audience === 'direction'
              ? 'Vue épurée, focus parcours & ROI'
              : 'Vue complète avec tracker d\'events et preview vector'}
          </p>
        </div>

        <div className="intro-actions">
          <button className="btn btn-coral btn-lg" onClick={() => handleStart(true)}>
            Lancer le parcours guidé →
          </button>
          <button className="btn btn-outline" onClick={() => handleStart(false)}>
            Explorer librement
          </button>
        </div>
      </div>
    </div>
  );
}
