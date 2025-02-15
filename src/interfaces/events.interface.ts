/**
 * @file Event-related interfaces and types
 */

/**
 * Form submission event detail type
 */
export interface FormSubmitEvent extends CustomEvent {
  detail: Record<string, any>;
}

/**
 * Type for form submission handler
 */
export type FormSubmitHandler = (data: Record<string, any>) => void;

/**
 * Custom events map for SmartForm
 */
export interface SmartFormEventMap {
  /** Fired when the form is submitted */
  "smartformio:submit": CustomEvent<Record<string, any>>;
}
