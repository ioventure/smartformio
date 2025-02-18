/**
 * @file Field-specific interfaces for different input types
 */

import { IBaseField } from "./core.interface";

/**
 * Properties for text-based input fields
 */
export interface ITextField extends IBaseField {
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
export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectField extends IBaseField {
  type: "select";
  /** Array of options to display in the dropdown */
  options: (ISelectOption | string)[];
  /** Icon to display at the start of the input */
  leadingIcon?: string;
}

/**
 * Properties for date inputs
 */
export interface IDateField extends IBaseField {
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
export interface IFileField extends IBaseField {
  type: "file";
  /** Accepted file types */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Icon to display at the start of the input */
  leadingIcon?: string;
  /** Maximum size of each file in KB */
  maxFileSize?: number;
  /** Maximum total size of all files in KB (for multiple file uploads) */
  maxTotalSize?: number;
  /** Maximum number of files allowed for multiple file upload */
  maxFiles?: number;
}

/**
 * Properties for radio button groups
 */
export interface IRadioOption {
  value: string;
  label: string;
}

export interface IRadioField extends IBaseField {
  type: "radio";
  /** Array of radio button options */
  options: (IRadioOption | string)[];
  /** Display layout for radio options: 'vertical' | 'horizontal' */
  display?: "vertical" | "horizontal";
}

/**
 * Properties for checkbox inputs
 */
export interface ICheckboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface ICheckboxField extends IBaseField {
  type: "checkbox";
  /** Array of checkbox options for groups */
  options?: (ICheckboxOption | string)[];
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
export type IFormFieldSchema =
  | ITextField
  | ISelectField
  | IDateField
  | IFileField
  | IRadioField
  | ICheckboxField;

/**
 * Type for field renderer functions
 */
export type IFieldRenderer = (field: IFormFieldSchema) => string;
