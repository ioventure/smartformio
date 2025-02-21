/**
 * @file Field components exports
 */

export { TextFieldElement } from './text-field.element';
export { CheckboxFieldElement } from './checkbox-field.element';
export { DateFieldElement } from './date-field.element';
export { FileFieldElement } from './file-field.element';
export { RadioFieldElement } from './radio-field.element';
export { SelectFieldElement } from './select-field.element';

// Export field-specific types
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface FileValidation {
  maxFileSize?: number; // in bytes
  maxTotalSize?: number; // in bytes
  maxFiles?: number;
  accept?: string;
}

export interface DateValidation {
  min?: string | Date;
  max?: string | Date;
}
