import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Scenario, ScenarioStep } from '../scenarios/types';
import demoDress from '../scenarios/demo-dress';

export type AudienceMode = 'direction' | 'marketing';

// Re-export for convenience
export type { Scenario, ScenarioStep };

// Active scenario — swap this to change the demo
const ACTIVE_SCENARIO: Scenario = demoDress;

interface DemoContextType {
  // Scenario
  scenario: Scenario;
  // Intro
  introSeen: boolean;
  setIntroSeen: (v: boolean) => void;
  // Audience
  audience: AudienceMode;
  setAudience: (m: AudienceMode) => void;
  // Story companion
  storyActive: boolean;
  storyStep: number;
  storyMinimized: boolean;
  startStory: () => void;
  nextStep: () => void;
  prevStep: () => void;
  jumpStep: (n: number) => void;
  minimizeStory: () => void;
  resumeStory: () => void;
  skipStory: () => void;
  currentStory: ScenarioStep | null;
}

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [introSeen, setIntroSeen] = useState(false);
  const [audience, setAudience] = useState<AudienceMode>('direction');
  const [storyActive, setStoryActive] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [storyMinimized, setStoryMinimized] = useState(false);

  const steps = ACTIVE_SCENARIO.steps;

  const startStory = useCallback(() => {
    setStoryActive(true);
    setStoryStep(0);
    setStoryMinimized(false);
  }, []);

  const nextStep = useCallback(() => {
    setStoryStep(prev => Math.min(prev + 1, steps.length - 1));
    setStoryMinimized(false);
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setStoryStep(prev => Math.max(prev - 1, 0));
    setStoryMinimized(false);
  }, []);

  const jumpStep = useCallback((n: number) => {
    setStoryStep(Math.max(0, Math.min(n, steps.length - 1)));
    setStoryMinimized(false);
  }, [steps.length]);

  const minimizeStory = useCallback(() => setStoryMinimized(true), []);
  const resumeStory = useCallback(() => setStoryMinimized(false), []);

  const skipStory = useCallback(() => {
    setStoryActive(false);
    setStoryMinimized(false);
  }, []);

  const currentStory = storyActive ? steps[storyStep] || null : null;

  return (
    <DemoContext.Provider value={{
      scenario: ACTIVE_SCENARIO,
      introSeen, setIntroSeen,
      audience, setAudience,
      storyActive, storyStep, storyMinimized,
      startStory, nextStep, prevStep, jumpStep,
      minimizeStory, resumeStory, skipStory,
      currentStory,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider');
  return ctx;
}
