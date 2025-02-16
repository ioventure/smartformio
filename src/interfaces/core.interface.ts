/**
 * @file Core interfaces and types for SmartFormIO
 */

/**
 * Configuration options for SmartFormIO
 */
export interface SmartFormConfig {
  /** Whether to validate on change */
  validateOnChange?: boolean;
}

/**
 * Base properties common to all form fields
 */
export interface BaseField {
  /** Unique identifier for the field */
  name: string;
  /** Label text to display above the field */
  label?: string;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Default value for the field */
  value?: string | number | boolean;
  /** Whether the field is readonly */
  readonly?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Additional CSS classes to apply */
  className?: string;
  /** Help text to display below the field */
  helpText?: string;
  /** Custom validation message */
  validationMessage?: string;
  /** Hide the label visually but keep it for screen readers */
  hiddenLabel?: boolean;
}

/**
 * Configuration for the entire form
 */
export interface FormSchema {
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Array of form fields */
  fields: FormFieldSchema[];
  /** Enable real-time validation on input */
  validateOnChange?: boolean;
  /** Custom text for the submit button */
  submitButtonText?: string;
}

// Import this here to avoid circular dependency
import { FormFieldSchema } from "./field.interface";
