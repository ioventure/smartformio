/**
 * @file Web component related interfaces and types
 */

/**
 * SmartForm web component element interface
 */
export interface SmartFormElement extends HTMLElement {
  /** The form schema as a JSON string */
  schema: string;
  /** Whether to disable default styles */
  disableDefaultStyles: boolean;
  /** Event handler for form submission */
  onSubmit?: (event: CustomEvent<Record<string, any>>) => void;
}

/**
 * SmartForm web component attributes
 */
export interface SmartFormAttributes {
  /** The form schema as a JSON string */
  schema?: string;
  /** Whether to disable default styles */
  "disable-default-styles"?: "";
}

/**
 * SmartForm CSS part names for styling
 */
export interface SmartFormParts {
  container: string;
  title: string;
  field: string;
  label: string;
  "input-wrapper": string;
  input: string;
  "input-invalid": string;
  "help-text": string;
  "error-text": string;
  button: string;
  "leading-icon": string;
  "trailing-icon": string;
  "checkbox-group": string;
  "checkbox-container": string;
  "checkbox-label": string;
  "checkbox-description": string;
  "radio-group": string;
  "radio-label": string;
}

/**
 * Form DOM elements interface
 */
export interface FormElements {
  input: HTMLInputElement;
  error: HTMLElement;
  help?: HTMLElement;
}
