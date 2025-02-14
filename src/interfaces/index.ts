/**
 * @file Main export file for all interfaces and types
 */

import {
  BaseField,
  TextField,
  SelectField,
  DateField,
  FileField,
  RadioField,
  CheckboxField,
  FormFieldSchema,
  FormSchema,
  FormSubmitEvent,
} from "./form.interface";

// Export all form interfaces
export {
  BaseField,
  TextField,
  SelectField,
  DateField,
  FileField,
  RadioField,
  CheckboxField,
  FormFieldSchema,
  FormSchema,
  FormSubmitEvent,
};

/**
 * Type for validation results
 */
export interface ValidationResult {
  /** Whether the field is valid */
  isValid: boolean;
  /** Optional validation error message */
  message?: string;
}

/**
 * Type for form submission handler
 */
export type FormSubmitHandler = (data: Record<string, any>) => void;

/**
 * Type for validation handler
 */
export type ValidationHandler = (
  field: FormFieldSchema,
  value: any
) => ValidationResult;

/**
 * Type for field renderer functions
 */
export type FieldRenderer = (field: FormFieldSchema) => string;

/**
 * Configuration options for SmartFormIO
 */
export interface SmartFormConfig {
  /** Whether to validate on change */
  validateOnChange?: boolean;
  /** Validation debounce time in milliseconds */
  validationDebounce?: number;
  /** Whether to disable default styles */
  disableDefaultStyles?: boolean;
  /** Custom validation handler */
  customValidation?: ValidationHandler;
}

// Export types for the web component
export interface SmartFormElement extends HTMLElement {
  /** The form schema as a JSON string */
  schema: string;
  /** Whether to disable default styles */
  disableDefaultStyles: boolean;
  /** Event handler for form submission */
  onSubmit?: (event: CustomEvent<Record<string, any>>) => void;
}

export interface SmartFormAttributes {
  /** The form schema as a JSON string */
  schema?: string;
  /** Whether to disable default styles */
  "disable-default-styles"?: "";
}

export interface SmartFormEventMap {
  /** Fired when the form is submitted */
  "smartformio:submit": CustomEvent<Record<string, any>>;
}

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
