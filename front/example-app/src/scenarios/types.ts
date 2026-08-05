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
  /** Key path within scenarios.json's `<scenario.i18nKey>` block, e.g. "steps.1" — resolves title/bubble/gain. */
  i18nKey: string;
  persona: Persona;
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
  /** Top-level key in scenarios.json — resolves name/description/personas/steps.*. */
  i18nKey: string;
  /** Persona display data for the intro screen. `name` is a literal (proper noun), not translated;
   *  role/merchant-name text lives in scenarios.json under personas.customer/merchant. */
  personas: {
    customer: { name: string; emoji: string };
    merchant: { emoji: string };
  };
  steps: ScenarioStep[];
}
