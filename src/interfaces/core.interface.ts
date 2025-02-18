/**
 * @file Core interfaces and types for SmartFormIO
 */

/**
 * Configuration options for SmartFormIO
 */
export interface ISmartFormConfig {
  /** Whether to validate on change */
  validateOnChange?: boolean;
}

/**
 * Base properties common to all form fields
 */
export interface IBaseField {
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
import { IApiConfig } from "./api.interface";

export interface IFormSchema {
  /** Form title */
  title?: string;
  /** Form description */
  description?: string;
  /** Array of form fields */
  fields: IFormFieldSchema[];
  /** Enable real-time validation on input */
  validateOnChange?: boolean;
  /** Custom text for the submit button */
  submitButtonText?: string;
  /** API configuration for form submission */
  api?: IApiConfig;
}

// Import this here to avoid circular dependency
import { IFormFieldSchema } from "./field.interface";
