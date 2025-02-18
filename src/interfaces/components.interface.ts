/**
 * @file Web component related interfaces and types
 */

import { FormSchema } from "./core.interface";

/**
 * SmartForm web component element interface
 */
export interface SmartFormIOElement extends HTMLElement {
  schema: string;
  formId: string;
}

/**
 * SmartForm web component element interface
 */
export interface SmartFormIOElement extends HTMLElement {
  schema: string;
  formId: string;
}

/**
 * SmartForm web component attributes interface
 */
export interface SmartFormIOAttributes {
  schema?: string;
}

/**
 * Props interface for SmartForm
 */
export interface SmartFormIOProps extends SmartFormIOAttributes {
  // Define additional properties for SmartFormIOProps
}

/**
 * SmartForm parts interface
 */
export interface SmartFormParts {
  // Define properties for SmartForm parts
}

/**
 * Form elements interface
 */
export interface FormElements {
  // Define properties for form elements
}

/**
 * SmartForm parts interface
 */
export interface SmartFormParts {
  // Define properties for SmartForm parts
}

/**
 * Form elements interface
 */
export interface FormElements {
  // Define properties for form elements
}

/**
 * Custom events interface for SmartForm
 */
export interface SmartFormEvents {
  "smartformio:submit": CustomEvent<any>;
  "smartformio:error": CustomEvent<any[]>;
  "smartformio:change": CustomEvent<any>;
}

/**
 * Props interface for React wrapper
 */
export interface SmartFormReactProps {
  schema: FormSchema;
  onSubmit?: (data: any) => void;
  onError?: (errors: any[]) => void;
  onChange?: (data: any) => void;
  className?: string;
}
