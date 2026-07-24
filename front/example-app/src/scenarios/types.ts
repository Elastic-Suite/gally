/** Persona speaking in a story step */
export type Persona = 'camille' | 'merchant';

/**
 * Action descriptors — each type has its own params.
 * The action engine interprets these generically.
 */
export type StepAction =
  | { type: 'type_and_search'; query: string; startRoute: string }
  | { type: 'highlight_sequence'; selector: string; childSelector: string; maxItems: number; interval: number }
  | { type: 'add_to_cart_flow'; searchQuery: string }
  | { type: 'navigate_only' };

/** A single step in a demo scenario */
export interface ScenarioStep {
  act: number;
  title: string;
  persona: Persona;
  bubble: string;
  gain: string;
  /** Route to navigate to when this step activates. Use __first__ as placeholder for first category. */
  target: string;
  /** CSS selector to spotlight (visual hint in the companion) */
  spotlight?: string;
  /** Action to auto-play when this step activates */
  action: StepAction;
}

/** Full scenario definition */
export interface Scenario {
  id: string;
  name: string;
  description: string;
  /** Persona names for the intro screen */
  personas: {
    customer: { name: string; emoji: string; role: string };
    merchant: { name: string; emoji: string; role: string };
  };
  steps: ScenarioStep[];
}
