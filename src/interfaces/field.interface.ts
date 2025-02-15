/**
 * @file Field-specific interfaces for different input types
 */

import { BaseField } from "./core.interface";

/**
 * Properties for text-based input fields
 */
export interface TextField extends BaseField {
  type: "text" | "email" | "password" | "number" | "textarea";
  /** Regular expression pattern for validation */
  pattern?: string;
  /** Icon to display at the start of the input */
  leadingIcon?: string;
  /** Icon to display at the end of the input */
  trailingIcon?: string;
  /** Minimum length for text input */
  minLength?: number;
  /** Maximum length for text input */
  maxLength?: number;
  /** Minimum value for number input */
  min?: number;
  /** Maximum value for number input */
  max?: number;
}

/**
 * Properties for select dropdowns
 */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectField extends BaseField {
  type: "select";
  /** Array of options to display in the dropdown */
  options: (SelectOption | string)[];
  /** Icon to display at the start of the input */
  leadingIcon?: string;
}

/**
 * Properties for date inputs
 */
export interface DateField extends BaseField {
  type: "date";
  /** Date format string */
  format?: string;
  /** Minimum allowed date */
  min?: string | number;
  /** Maximum allowed date */
  max?: string | number;
  /** Icon to display at the start of the input */
  leadingIcon?: string;
}

/**
 * Properties for file inputs
 */
export interface FileField extends BaseField {
  type: "file";
  /** Accepted file types */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Icon to display at the start of the input */
  leadingIcon?: string;
}

/**
 * Properties for radio button groups
 */
export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioField extends BaseField {
  type: "radio";
  /** Array of radio button options */
  options: (RadioOption | string)[];
  /** Display layout for radio options: 'vertical' | 'horizontal' */
  display?: "vertical" | "horizontal";
}

/**
 * Properties for checkbox inputs
 */
export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
  /** Array of checkbox options for groups */
  options?: (CheckboxOption | string)[];
  /** Description for single checkbox */
  description?: string;
  /** Display layout for checkbox options: 'vertical' | 'horizontal' */
  display?: "vertical" | "horizontal";
  /** Minimum number of options that must be selected */
  minSelect?: number;
  /** Maximum number of options that can be selected */
  maxSelect?: number;
}

/**
 * Union type of all possible field types
 */
export type FormFieldSchema =
  | TextField
  | SelectField
  | DateField
  | FileField
  | RadioField
  | CheckboxField;

/**
 * Type for field renderer functions
 */
export type FieldRenderer = (field: FormFieldSchema) => string;
